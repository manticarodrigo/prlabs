import { createId } from '@paralleldrive/cuid2'
import { kv } from '@vercel/kv'
import { LangChainStream, StreamingTextResponse } from 'ai'
import { OpenAI } from 'langchain'
import { NextRequest } from 'next/server'

import { db, eq, schema } from '@/lib/drizzle'
import { getNewsArticleMetadata } from '@/lib/newscatcher'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { prompt: id } = await req.json()

  const article = await db.query.article.findFirst({
    where: eq(schema.article.id, id),
    with: {
      author: true,
    },
  })

  const metadata = getNewsArticleMetadata(article)

  const summarizationPrompt = await kv.get('native-prompt')

  const { stream, handlers } = LangChainStream()

  const llm = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    streaming: true,
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
      {},
      [handlers],
    )
    .then(async (res) => {
      await db.insert(schema.articleAnalysis).values({
        id: createId(),
        articleId: id,
        content: res,
        updatedAt: new Date().toISOString(),
      })
    })

  return new StreamingTextResponse(stream)
}
