import { ChatOpenAI } from 'langchain/chat_models/openai'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

export async function makeRetrievalQAChain({ texts, metadatas }) {
  const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    streaming: true,
  })

  const vectorStore = await MemoryVectorStore.fromTexts(
    texts,
    metadatas,
    new OpenAIEmbeddings(),
  )

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
  )

  return chain
}
