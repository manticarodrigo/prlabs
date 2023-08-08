// eslint-disable-next-line simple-import-sort/imports
import { createId } from '@paralleldrive/cuid2'

import { kv } from '@vercel/kv'
import { OpenAI } from 'langchain/llms/openai'
import invariant from 'tiny-invariant'

import { getNewsArticleMetadata } from '@/app/api/article/model'
import { and, db, desc, eq, schema } from '@/lib/drizzle'
import { NewsCatcherArticle, getAuthorArticles } from '@/lib/newscatcher'
import { mostCommonString } from '@/util/string'



export function getJournalists() {
  return db.select().from(schema.author)
}

export function upsertJournalist(articles: NewsCatcherArticle[]) {
  const names = articles.map(({ author }) => author)
  const outlets = articles.map(({ clean_url }) => clean_url ?? '')
  const name = mostCommonString(names) ?? ''
  const outlet = mostCommonString(outlets) ?? ''

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
            ...rest,
            id: createId(),
            authorId: author?.id,
            external_id: _id,
            external_score: _score,
            published_date: new Date(published_date ?? '').toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        ),
      )
      .onConflictDoNothing()

    return author
  })
}

export async function getJournalistSummaries(id: string, take = 10) {
  const author = await db.query.author.findFirst({
    where: eq(schema.author.id, id),
  })

  invariant(author, 'Author not found')
  invariant(author.name, 'Author not found')
  invariant(author.outlet, 'Author not found')

  const { articles: _articles } = await getAuthorArticles(author.name, author.outlet)

  await upsertJournalist(_articles)

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
  }) ?? { articles: [] }

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
