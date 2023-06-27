import { PromptTemplate } from 'langchain/prompts'
import { makeRetrievalQAChain } from '@/lib/langchain'
import { getNewsArticles } from '@/lib/newscatcher'
import { getNotionPrompt } from '@/lib/notion'

export const runtime =
  process.env.VERCEL_ENV === 'development' ? 'nodejs' : 'edge'

export async function POST(request) {
  const res = await request.formData()
  const entries = Object.fromEntries(res.entries())
  const { interviewee, interviewer, outlet, prompt } = entries

  const template = PromptTemplate.fromTemplate(await getNotionPrompt('brief'))

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
      async handleLLMEnd() {
        await writer.ready
        await writer.close()
      },
    },
  ])

  return new Response(stream.readable)
}
