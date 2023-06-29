export async function getNewsArticles(author, source) {
  const endpoint = 'https://api.newscatcherapi.com/v2/search'

  const query = {
    author,
    q: '*',
    lang: 'en',
    from: '2023-01-01',
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
