import { RetrievalQAChain, loadQARefineChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { OpenAI } from 'langchain/llms/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

export async function makeRetrievalQAChain(articles) {
  const model = new OpenAI({
    modelName: 'gpt-3.5-turbo-16k',
    streaming: true,
  })

  const vectorStore = await MemoryVectorStore.fromTexts(
    articles.map(({ summary, excerpt }) => summary || excerpt),
    articles.map(({ summary, excerpt, ...metadata }) => metadata),
    new OpenAIEmbeddings(),
  )

  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQARefineChain(model),
    retriever: vectorStore.asRetriever(),
  })

  return chain
}
