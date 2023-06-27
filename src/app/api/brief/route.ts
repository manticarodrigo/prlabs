import { PromptTemplate } from 'langchain/prompts'
import { makeRetrievalQAChain } from '@/lib/langchain'
import { getNewsArticles } from '@/lib/newscatcher'
import { getNotionDb } from '@/lib/notion'

export const runtime =
  process.env.VERCEL_ENV === 'development' ? 'nodejs' : 'edge'

export async function POST(request) {
  const res = await request.formData()
  const entries = Object.fromEntries(res.entries())
  const { interviewee, interviewer, outlet, prompt } = entries

  const { results } = await getNotionDb()

  const result = results.find(
    (result) =>
      result.properties.pathname?.rich_text[0]?.plain_text === 'brief',
  )
  const template = PromptTemplate.fromTemplate(
    result.properties.prompt?.rich_text[0]?.plain_text,
  )

  const query = await template.format({
    interviewee,
    interviewer,
    outlet,
    prompt,
  })

  const articles = await getNewsArticles(interviewer, outlet)
  const chain = await makeRetrievalQAChain(articles)

  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  chain.call({ query }, [
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
