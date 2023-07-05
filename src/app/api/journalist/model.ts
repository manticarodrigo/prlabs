import { kv } from '@vercel/kv'
import { OpenAI } from 'langchain'

import { getNewsArticleMetadata, getNewsArticles } from '@/lib/newscatcher'
import prisma from '@/lib/prisma'
import { mostCommonString } from '@/util/string'

export function upsertJournalist(articles) {
  const names: string[] = articles.map(({ author }) => author)
  const outlets: string[] = articles.map(({ clean_url }) => clean_url)
  const name = mostCommonString(names)
  const outlet = mostCommonString(outlets)

  const articlePayload = {
    connectOrCreate: articles.map(
      ({ _id, _score, published_date, author, ...rest }) => ({
        where: {
          external_id: _id,
        },
        create: {
          ...rest,
          external_id: _id,
          external_score: _score,
          published_date: new Date(published_date),
        },
      }),
    ),
  }

  return prisma.author.upsert({
    where: {
      name_outlet: {
        name,
        outlet,
      },
    },
    create: {
      name,
      outlet,
      articles: articlePayload,
    },
    update: {
      articles: articlePayload,
    },
  })
}

export async function getJournalistSummaries(id, take = 15) {
  const author = await prisma.author.findUnique({
    where: {
      id,
    },
  })

  await upsertJournalist(await getNewsArticles(author.name, author.outlet))

  const articles = await prisma.article.findMany({
    where: {
      author: {
        name: author.name,
        outlet: author.outlet,
      },
    },
    take,
    orderBy: {
      published_date: 'desc',
    },
    include: {
      author: true,
      analyses: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

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
          await prisma.articleAnalysis.create({
            data: {
              articleId: article.id,
              content: res,
            },
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
