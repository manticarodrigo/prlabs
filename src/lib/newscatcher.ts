import dayjs from 'dayjs'
import invariant from 'tiny-invariant'

import { Article, Author } from '@/lib/drizzle'

export type NewsCatcherArticle = Omit<Article, "external_id" | "external_score"> & {
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
  ranked_only?: boolean
  from_rank?: number
  sort_by?: 'relevancy' | 'date' | 'rank'
  page_size?: number
}

export async function fetchArticles(query: NewsCatcherQuery) {
  const endpoint = 'https://api.newscatcherapi.com/v2/search'
  const res = await fetch(`${endpoint}?${new URLSearchParams(JSON.parse(JSON.stringify(query)))}`, {
    headers: { 'x-api-key': process.env.NEWSCATCHER_API_KEY ?? '', },
  })
  invariant(res.ok, `Unable to fetch articles.`)
  const json = await res.json() as { articles: NewsCatcherArticle[] }
  return (json.articles || []).filter((article) => article.summary && article.excerpt && article.authors)
}

export function getAuthorArticles(author: string, source: string) {
  return fetchArticles({
    q: '*',
    author,
    sources: source,
    lang: 'en',
    from: dayjs().subtract(180, 'days').format('YYYY-MM-DD'),
    sort_by: 'relevancy',
    page_size: 200,
  })
}

export function getTopicArticles(topics: string[]) {
  return fetchArticles({
    q: topics.join(' OR '),
    lang: 'en',
    countries: 'US',
    from: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    sort_by: "relevancy",
    from_rank: 100,
    page_size: 200,
  })
}

export function getNewsArticleMetadata({
  author,
  link,
  published_date,
  country,
  language,
  authors,
  twitter_account,
  is_opinion,
}: Article & { author: Author | null }) {
  return `
        author: ${author?.name}
        outlet: ${author?.outlet}
        link: ${link}
        date: ${published_date}
        country: ${country}
        language: ${language}
        authors: ${authors}
        twitter account: ${twitter_account}
        is opinion: ${is_opinion}
  `
}
