export async function getNewsArticles(author, source) {
  const endpoint = 'https://api.newscatcherapi.com/v2/search'

  const query = {
    author,
    q: '*',
    lang: 'en',
    from: '2023-01-01',
    sources: source,
    page_size: 10,
  }

  const res = await fetch(`${endpoint}?${new URLSearchParams(query)}`, {
    headers: {
      'x-api-key': process.env.NEWSCATCHER_API_KEY,
    },
  })

  const json = await res.json()

  return json.articles || []
}

export async function getNewsTexts(author, source) {
  const articles = await getNewsArticles(author, source)
  const texts = articles.map(
    (article) => article.summary.substring(0, 5000) || ' ',
  )

  const metadatas = articles.map((article) => {
    delete article.summary
    return article
  })

  return { texts, metadatas }
}
