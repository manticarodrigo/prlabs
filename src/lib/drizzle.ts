import { sql } from '@vercel/postgres'
import { InferModel } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/vercel-postgres'

import * as schema from '../../drizzle/schema'

export const db = drizzle(sql, { schema, logger: true })

export type Article = InferModel<typeof schema.article>
export type ArticleAnalysis = InferModel<typeof schema.articleAnalysis>
export type Author = InferModel<typeof schema.author>
export type Keyword = InferModel<typeof schema.keyword>
export type Team = InferModel<typeof schema.team> & { keywords?: Keyword[] }

export type ArticleWithAnalyses = Article & { analyses?: ArticleAnalysis[] }

export type AuthorWithArticlesWithAnalyses = Author & {
  articles?: ArticleWithAnalyses[]
}

export * from 'drizzle-orm'
export { schema }

