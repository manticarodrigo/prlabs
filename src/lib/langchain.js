import { OpenAI } from 'langchain/llms/openai'
import { RetrievalQAChain } from 'langchain/chains'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

export async function streamLLMChain(fn) {
  const encoder = new TextEncoder()

  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  const model = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    streaming: true,
    callbacks: [
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
    ],
  })

  fn(model)

  return stream.readable
}

export function answerContextualQuery(query, texts, metadatas) {
  return async function (model) {
    const vectorStore = await MemoryVectorStore.fromTexts(
      texts,
      metadatas,
      new OpenAIEmbeddings(),
    )

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever())

    await chain.call({ query })
  }
}
