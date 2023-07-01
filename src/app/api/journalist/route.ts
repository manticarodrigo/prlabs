import { LangChainStream, StreamingTextResponse } from 'ai'
import { OpenAI } from 'langchain'
import { NextRequest } from 'next/server'

import { getNewsArticles, prepareNewsArticle } from '@/lib/newscatcher'
import { getNotionPrompts } from '@/lib/notion'
import prisma from '@/lib/prisma'

import { upsertJournalist } from '../journalist/model'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { prompt: id } = await req.json()

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
    take: 10,
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

  const prompts = await getNotionPrompts()
  const summarizationPrompt = prompts.find((p) => p.key === 'native').prompt
  const analysisPrompt = prompts
    .find((p) => p.key === 'journalist')
    .prompt.replace(/{interviewer}/g, author.name)
    .replace(/{outlet}/g, author.outlet)

  const { stream, handlers } = LangChainStream()

  const summarizationLlm = new OpenAI({
    modelName: 'gpt-3.5-turbo',
  })

  const summaries = await Promise.all(
    articles.map((article) => {
      if (article.analyses.length > 0) {
        return article.analyses[0].content
      }
      return summarizationLlm
        .call(
          `
            ${summarizationPrompt}

            News article:
            ${prepareNewsArticle(article)}
          `,
        )
        .then(async (res) => {
          await prisma.articleAnalysis.create({
            data: {
              articleId: article.id,
              content: res,
            },
          })
        })
    }),
  )

  const responseLlm = new OpenAI({
    modelName: 'gpt-3.5-turbo-16k',
    streaming: true,
    callbacks: [handlers],
  })

  responseLlm.call(`
    ${analysisPrompt}

    Article summaries:
    ${summaries.join('\n###########\n')}
  `)

  return new StreamingTextResponse(stream)
}
