import dayjs from 'dayjs'

export async function getNewsArticles(author, source) {
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
      'x-api-key': process.env.NEWSCATCHER_API_KEY,
    },
  })

  const json = await res.json()

  return (json.articles || []).filter((article) => article.summary)
}

export function prepareNewsArticle({
  author,
  summary,
  excerpt,
  link,
  published_date,
  country,
  language,
  authors,
  twitter_account,
  is_opinion,
}) {
  return `
        author: ${author}
        link: ${link}
        date: ${published_date}
        country: ${country}
        language: ${language}
        authors: ${authors}
        twitter account: ${twitter_account}
        is opinion: ${is_opinion}
        content: ${summary || excerpt}
  `
}
