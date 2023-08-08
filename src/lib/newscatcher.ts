import dayjs from 'dayjs'
import invariant from 'tiny-invariant'
import { z } from 'zod'

import { Article } from '@/lib/drizzle'

export type NewsCatcherArticle = Omit<
  Article,
  'id' | 'authorId' | 'external_id' | 'external_score' | 'createdAt' | 'updatedAt'
> & {
  _id: string
  _score: number
  author: string
}

interface NewsCatcherQuery {
  q: string
  lang?: string
  countries?: string
  from?: string
  author?: string
  sources?: string
  topic?: string
  ranked_only?: boolean
  from_rank?: number
  to_rank?: number
  sort_by?: 'relevancy' | 'date' | 'rank'
  page_size?: number
}

const articleResponseSchema = z.object({
  status: z.string(),
  total_hits: z.number(),
  page: z.number(),
  total_pages: z.number(),
  page_size: z.number(),
})

export async function fetchArticles(query: NewsCatcherQuery) {
  const endpoint = 'https://api.newscatcherapi.com/v2/search'
  const res = await fetch(
    `${endpoint}?${new URLSearchParams(JSON.parse(JSON.stringify(query)))}`,
    {
      headers: { 'x-api-key': process.env.NEWSCATCHER_API_KEY ?? '' },
    },
  )
  invariant(res.ok, `Unable to fetch articles.`)
  const json = (await res.json()) as { articles: NewsCatcherArticle[] }
  return {
    ...articleResponseSchema.parse(json),
    articles: (json.articles || []).filter(
      (article) => {
        const length = article.summary?.length ?? 0
        if (length < 5000) return false
        return (article.summary && article.excerpt && article.authors)?.slice(0, 10000)
      },
    ),
  }
}

export function getAuthorArticles(author: string, source: string) {
  return fetchArticles({
    q: '*',
    author,
    sources: source,
    lang: 'en',
    from: dayjs().subtract(180, 'days').format('YYYY-MM-DD'),
    sort_by: 'relevancy',
    page_size: 100,
  })
}

export function getTopicArticles(topics: string[]) {
  return fetchArticles({
    q: topics.join(' OR '),
    lang: 'en',
    countries: 'US',
    from: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    to_rank: 100,
    sort_by: 'relevancy',
    page_size: 200,
  })
}
