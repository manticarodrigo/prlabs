import dayjs from 'dayjs'

import { Article, Author } from '@/lib/drizzle'

export type NewsCatcherArticle = Omit<Article, "external_id" | "external_score"> & {
  _id: string
  _score: number
  author: string
}

interface NewsCatcherQuery {
  author?: string
  sources?: string
  q?: string
  lang?: string
  from?: string
  to?: string
  sort_by?: 'relevancy' | 'date' | 'rank'
  page_size?: number
}

export async function fetchArticles({
  author,
  sources,
  q = '*',
  lang = 'en',
  from = dayjs().subtract(180, 'days').format('YYYY-MM-DD'),
  sort_by = 'relevancy',
  page_size = 100,
}: NewsCatcherQuery) {
  const endpoint = 'https://api.newscatcherapi.com/v2/search'

  const query = JSON.parse(JSON.stringify({
    author,
    sources,
    q,
    lang,
    from,
    sort_by,
    page_size,
  }))

  const res = await fetch(`${endpoint}?${new URLSearchParams(query)}`, {
    headers: {
      'x-api-key': process.env.NEWSCATCHER_API_KEY ?? '',
    },
  })

  const json = await res.json() as { articles: NewsCatcherArticle[] }

  return (json.articles || []).filter((article) => article.summary)
}

export function getAuthorArticles(author: string, source: string) {
  return fetchArticles({
    author,
    sources: source,
  })
}

export function getTopicArticles(topics: string[]) {
  return fetchArticles({
    q: topics.join(' OR '),
    from: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    sort_by: "rank"
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
