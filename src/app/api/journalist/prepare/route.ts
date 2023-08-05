import { createId } from '@paralleldrive/cuid2'
import { kv } from '@vercel/kv'
import { OpenAI } from 'langchain'
import { NextRequest, NextResponse } from 'next/server'

import { db, desc, eq, schema } from '@/lib/drizzle'
import { getNewsArticleMetadata } from '@/lib/newscatcher'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { id } = await req.json()

  const author = await db.query.author.findFirst({
    where: eq(schema.author.id, id),
    with: {
      articles: {
        limit: 10,
        orderBy: [desc(schema.article.published_date)],
        with: {
          author: true,
          analyses: true,
        },
      },
    },
  })

  const articles = author?.articles.filter((article) => !article.analyses.length) ?? []

  const summarizationPrompt = await kv.get('native-prompt')

  const llm = new OpenAI({
    modelName: 'gpt-3.5-turbo-16k',
  })

  const summaries = await Promise.all(
    articles.map(async (article) => {
      const metadata = getNewsArticleMetadata(article)
      const summary = await llm.call(
        `
            ${summarizationPrompt}

            Article metadata:
            ${metadata}

            Article content:
            ${article.summary || article.excerpt}
        `,
      )
      return { article, summary }
    }),
  )

  await db.insert(schema.articleAnalysis).values(
    summaries.map(({ article, summary }) => ({
      id: createId(),
      articleId: article.id,
      content: summary,
      updatedAt: new Date().toISOString(),
    })),
  )

  return NextResponse.json({ count: summaries.length })
}
