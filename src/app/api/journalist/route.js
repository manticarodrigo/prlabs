import { makeRetrievalQAChain } from '@/lib/langchain'
import { getNewsArticles } from '@/lib/newscatcher'

export const runtime = 'edge'

export async function POST(request) {
  const res = await request.formData()
  const entries = Object.fromEntries(res.entries())

  const { interviewer, outlet } = entries

  const prompts = [
    `Analyze the provided articles from journalist ${interviewer} at news outlet ${outlet} to answer the following prompts:`,
    'Approach:',
    'Provide a 5-10 line paragraph explaining how best to reach out to the journalist based on interests, narratives, central themes, and trends in their writing.',
    'Narratives:',
    'What are the top 5 narratives that this journalist has been focused on in recent articles? Provide the answer in a bulleted list weighted by (%). Each bullet should have links to related articles and a sublist of sub-trends that could be used to pitch the journalist to continue their narrative on that topic.',
    'Keywords:',
    'What are the most repeated keywords in recent articles?',
    'Brands & People:',
    'What are the most mentioned companies and people in recent articles?',
  ]

  const articles = await getNewsArticles(interviewer, outlet)
  const chain = await makeRetrievalQAChain(articles)

  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  chain.call({ query: prompts.join('\n') }, [
    {
      async handleLLMNewToken(token) {
        await writer.ready
        await writer.write(encoder.encode(`${token}`))
      },
      async handleLLMClose() {
        await writer.ready
        await writer.close()
      },
    },
  ])

  return new Response(stream.readable)
}
