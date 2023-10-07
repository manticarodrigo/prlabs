import { NewsResponseSchema } from '@/schema/brave'

export async function fetchNewsArticles(query: string) {
  const response = await fetch(
    `https://api.search.brave.com/res/v1/news/search?q=${query}&result_filter=web,news&text_decorations=false`,
    {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY ?? '',
      },
    },
  )
  const json = await response.json()
  return NewsResponseSchema.parse(json)
}
