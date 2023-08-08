import { createId } from '@paralleldrive/cuid2'
import { kv } from '@vercel/kv'
import { LangChainStream, StreamingTextResponse } from 'ai'
import { OpenAI } from 'langchain/llms/openai'
import { NextRequest } from 'next/server'
import invariant from 'tiny-invariant'

import { getNewsArticleMetadata } from '@/app/api/article/model'
import { db, eq, schema } from '@/lib/drizzle'


export async function POST(req: NextRequest) {
  const { prompt: id } = await req.json()

  const article = await db.query.article.findFirst({
    where: eq(schema.article.id, id),
    with: {
      author: true,
    },
  })

  invariant(article, 'Article not found.')

  const metadata = getNewsArticleMetadata(article)

  const summarizationPrompt = await kv.get('native-prompt')

  const { stream, handlers } = LangChainStream({
    onCompletion: async (res) => {
      await db.insert(schema.articleAnalysis).values({
        id: createId(),
        articleId: id,
        content: res,
        updatedAt: new Date().toISOString(),
      })
    },
  })

  const llm = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    streaming: true,
  })

  llm.call(
    `
        ${summarizationPrompt}

        Article metadata:
        ${metadata}

        Article content:
        ${article.summary || article.excerpt}
  `,
    {},
    [handlers],
  )

  return new StreamingTextResponse(stream)
}
