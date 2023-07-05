import { kv } from '@vercel/kv'
import { LangChainStream, StreamingTextResponse } from 'ai'
import { OpenAI } from 'langchain'
import { NextRequest } from 'next/server'

import { getNewsArticleMetadata } from '@/lib/newscatcher'
import prisma from '@/lib/prisma'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { prompt: id } = await req.json()

  const article = await prisma.article.findUnique({
    where: {
      id,
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

  const metadata = getNewsArticleMetadata(article)

  const summarizationPrompt = await kv.get('native-prompt')

  const { stream, handlers } = LangChainStream()

  const llm = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    streaming: true,
    callbacks: [{ ...handlers, handleChainEnd: () => {} }],
  })

  llm
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
          articleId: id,
          content: res,
        },
      })

      handlers.handleChainEnd()
    })

  return new StreamingTextResponse(stream)
}
