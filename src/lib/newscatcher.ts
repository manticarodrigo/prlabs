import dayjs from 'dayjs'

import { Article, Author } from '@/lib/drizzle'

export type NewsArticle = Article & {
  _id: string
  _score: number
  author: string
}

export async function getNewsArticles(author: string, source: string) {
  const endpoint = 'https://api.newscatcherapi.com/v2/search'

  const query = {
    author,
    q: '*',
    lang: 'en',
    from: dayjs().subtract(180, 'days').format('YYYY-MM-DD'),
    sources: source,
    page_size: '100',
  }

  const res = await fetch(`${endpoint}?${new URLSearchParams(query)}`, {
    headers: {
      'x-api-key': process.env.NEWSCATCHER_API_KEY ?? '',
    },
  })

  const json = await res.json() as { articles: NewsArticle[] }

  return (json.articles || []).filter((article) => article.summary)
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
