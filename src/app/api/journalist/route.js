import { makeRetrievalQAChain } from '@/lib/langchain'
import { getNewsTexts } from '@/lib/newscatcher'

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
    'Brands:',
    'What are the top 5 most discussed companies and corresponding executives in recent articles?',
  ]

  const { texts, metadatas } = await getNewsTexts(interviewer, outlet)

  const chain = await makeRetrievalQAChain({
    texts,
    metadatas,
  })

  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  chain.call(
    {
      question: prompts.join('\n'),
      chat_history: [],
    },
    [
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
    ],
  )

  return new Response(stream.readable)
}
