import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

const nonStreamingLlm = new ChatOpenAI({ modelName: 'gpt-3.5-turbo-16k' })

export async function makeRetrievalQAChain(
  llm,
  texts: { text: string; metadata: any }[],
) {
  const vectorStore = await MemoryVectorStore.fromTexts(
    texts.map(({ text }) => text),
    texts.map(({ metadata }) => metadata),
    new OpenAIEmbeddings(),
  )

  const chain = ConversationalRetrievalQAChain.fromLLM(
    llm,
    vectorStore.asRetriever(),
    {
      questionGeneratorChainOptions: {
        llm: nonStreamingLlm,
      },
    },
  )

  return chain
}
