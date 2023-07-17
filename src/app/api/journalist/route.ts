import { LangChainStream, Message, StreamingTextResponse } from 'ai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIChatMessage, HumanChatMessage } from 'langchain/schema'
import { NextRequest } from 'next/server'

import { getJournalistSummaries } from '@/app/api/journalist/model'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  console.log('starting journalist chat routine')

  const { messages, id } = await req.json()

  const { stream, handlers } = LangChainStream()

  const llm = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-16k',
    streaming: true,
  })

  handlers.handleLLMNewToken('Loading articles...\n\n')

  getJournalistSummaries(id)
    .then((summaries) => {
      console.log('got summaries', summaries.length)
      llm
        .call(
          (messages as Message[]).map((m, i) => {
            const isLast = i === messages.length - 1

            if (isLast) {
              m.content = `
              ${m.content}
  
              Article summaries / analyses:
              ${summaries.join('\n####\n')}
            `
            }
            return m.role == 'user'
              ? new HumanChatMessage(m.content)
              : new AIChatMessage(m.content)
          }),
          {},
          [handlers],
        )
        .catch((e) => console.error(e.message))
    })
    .catch((e) => {
      stream.cancel()
      console.error(e.message)
    })

  return new StreamingTextResponse(stream)
}
