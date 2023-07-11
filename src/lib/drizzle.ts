import { InferModel } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { article, articleAnalysis, author } from '../../drizzle/schema'

const client = postgres(process.env.POSTGRES_URL_NON_POOLING, {
  ssl:
    process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'development'
      ? 'require'
      : undefined,
})

export const db = drizzle(client, { logger: true })
export { article, articleAnalysis, author }

export type Article = InferModel<typeof article>
export type ArticleAnalysis = InferModel<typeof articleAnalysis>
export type Author = InferModel<typeof author>
