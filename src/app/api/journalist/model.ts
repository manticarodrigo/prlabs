import { createId } from '@paralleldrive/cuid2'
import { kv } from '@vercel/kv'
import { OpenAI } from 'langchain'

import { and, db, desc, eq, schema } from '@/lib/drizzle'
import { getNewsArticleMetadata, getNewsArticles } from '@/lib/newscatcher'
import { mostCommonString } from '@/util/string'

export function upsertJournalist(articles) {
  const names: string[] = articles.map(({ author }) => author)
  const outlets: string[] = articles.map(({ clean_url }) => clean_url)
  const name = mostCommonString(names)
  const outlet = mostCommonString(outlets)

  return db.transaction(async (tx) => {
    let author = await tx.query.author.findFirst({
      where: and(
        eq(schema.author.name, name),
        eq(schema.author.outlet, outlet),
      ),
    })

    if (!author) {
      author = (
        await tx
          .insert(schema.author)
          .values({
            id: createId(),
            name,
            outlet,
          })
          .returning()
      )[0]
    }

    await tx
      .insert(schema.article)
      .values(
        articles.map(
          ({
            _id,
            _score,
            published_date,
            author: _unused_author,
            clean_url,
            ...rest
          }) => ({
            id: createId(),
            authorId: author.id,
            external_id: _id,
            external_score: _score,
            published_date: new Date(published_date),
            updatedAt: new Date(),
            ...rest,
          }),
        ),
      )
      .onConflictDoNothing()

    return author
  })
}

export async function getJournalistSummaries(id, take = 10) {
  console.log('getting author')
  const author = await db.query.author.findFirst({
    where: eq(schema.author.id, id),
  })

  console.log('getting news articles')
  const _articles = await getNewsArticles(author.name, author.outlet)

  console.log('upserting journalist')
  await upsertJournalist(_articles)

  console.log('getting db articles')
  const { articles } = await db.query.author.findFirst({
    where: and(
      eq(schema.author.name, author.name),
      eq(schema.author.outlet, author.outlet),
    ),
    columns: {},
    with: {
      articles: {
        limit: take,
        orderBy: desc(schema.article.published_date),
        with: {
          author: true,
          analyses: {
            orderBy: desc(schema.articleAnalysis.createdAt),
          },
        },
      },
    },
  })

  console.log('found db articles', articles.length)

  const summarizationPrompt = await kv.get('native-prompt')

  const summarizationLlm = new OpenAI({
    modelName: 'gpt-3.5-turbo',
  })

  const summaries = await Promise.all(
    articles.map((article) => {
      const metadata = getNewsArticleMetadata(article)
      if (article.analyses.length > 0) {
        return `
          Article metadata:
          ${metadata}

          Article summary/analysis:
          ${article.analyses[0].content}
        `
      }
      return summarizationLlm
        .call(
          `
            ${summarizationPrompt}

            Article metadata:
            ${metadata}

            Article content:
            ${article.summary || article.excerpt}
          `,
        )
        .then(async (res) => {
          console.log('inserting analysis')
          await db.insert(schema.articleAnalysis).values({
            id: createId(),
            articleId: article.id,
            content: res,
            updatedAt: new Date().toISOString(),
          })

          return `
            Article metadata:
            ${metadata}

            Article summary/analysis:
            ${res}
          `
        })
    }),
  )

  return summaries
}
