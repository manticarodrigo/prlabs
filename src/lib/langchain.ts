import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Article } from './prisma'

const nonStreamingLlm = new ChatOpenAI({ modelName: 'gpt-3.5-turbo-16k' })

export async function makeRetrievalQAChain(llm, author, articles: Article[]) {
  const vectorStore = await MemoryVectorStore.fromTexts(
    articles.map(
      ({
        summary,
        excerpt,
        link,
        published_date,
        country,
        language,
        authors,
        twitter_account,
        is_opinion,
      }) =>
        `
          Publication author: ${author}
          Publication content: ${summary || excerpt}
          Publication link: ${link}
          Publication date: ${published_date}
          Publication country: ${country}
          Publication language: ${language}
          Publication authors: ${authors}
          Publication twitter account: ${twitter_account}
          Publication is opinion: ${is_opinion}
    `,
    ),
    articles.map(({ summary, excerpt, ...metadata }) => metadata),
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
