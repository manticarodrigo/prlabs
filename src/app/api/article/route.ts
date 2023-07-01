import { LangChainStream, StreamingTextResponse } from 'ai'
import { OpenAI } from 'langchain'
import { NextRequest } from 'next/server'

import { prepareNewsArticle } from '@/lib/newscatcher'
import { getNotionPrompts } from '@/lib/notion'
import prisma from '@/lib/prisma'

export const runtime =
  process.env.VERCEL_ENV === 'development' ? 'nodejs' : 'edge'

export async function POST(req: NextRequest) {
  const { prompt: id } = await req.json()

  const article = await prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  })

  const prompts = await getNotionPrompts()
  const summarizationPrompt = prompts.find((p) => p.key === 'native')

  const { stream, handlers } = LangChainStream()

  const llm = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    streaming: true,
    callbacks: [{ ...handlers, handleChainEnd: () => {} }],
  })

  llm
    .call(
      `
    ${summarizationPrompt.prompt}

    News article:
    ${prepareNewsArticle(article)}
  `,
    )
    .then(async (res) => {
      await prisma.articleAnalysis.create({
        data: {
          articleId: id,
          content: res,
        },
      })

      handlers.handleChainEnd()
    })

  return new StreamingTextResponse(stream)
}
