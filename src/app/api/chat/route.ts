import { LangChainStream, StreamingTextResponse } from 'ai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIChatMessage, HumanChatMessage } from 'langchain/schema'

import { makeRetrievalQAChain } from '@/lib/langchain'
import { getNewsArticles } from '@/lib/newscatcher'

import { upsertJournalist } from '../journalist/model'

export const runtime =
  process.env.VERCEL_ENV === 'development' ? 'nodejs' : 'edge'

export async function POST(req) {
  const { messages, interviewer, outlet } = await req.json()

  const message = messages.pop()

  const articles = await getNewsArticles(interviewer, outlet)

  await upsertJournalist(articles)

  const { stream, handlers } = LangChainStream()

  const llm = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-16k',
    streaming: true,
    callbacks: [handlers],
  })

  const chain = await makeRetrievalQAChain(llm, interviewer, articles)

  chain
    .call({
      chat_history: messages.map((m) =>
        m.role == 'user'
          ? new HumanChatMessage(m.content)
          : new AIChatMessage(m.content),
      ),
      question: message.content,
    })
    .catch(console.error)

  return new StreamingTextResponse(stream)
}
