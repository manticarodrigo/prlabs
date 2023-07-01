import { LangChainStream, StreamingTextResponse } from 'ai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIChatMessage, HumanChatMessage } from 'langchain/schema'
import { NextRequest } from 'next/server'

import { makeRetrievalQAChain } from '@/lib/langchain'
import { getNewsArticles, prepareNewsArticle } from '@/lib/newscatcher'

import { upsertJournalist } from '../journalist/model'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
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

  const chain = await makeRetrievalQAChain(
    llm,
    articles.map((article) => ({
      text: prepareNewsArticle(article),
      metadata: { ...article, summary: undefined, excerpt: undefined },
    })),
  )

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
