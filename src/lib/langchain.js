import { ChatOpenAI } from 'langchain/chat_models/openai'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PrismaVectorStore } from 'langchain/vectorstores/prisma'
import { Prisma } from '@prisma/client'

import db from '@/lib/prisma'

export async function makeRetrievalQAChain(articles) {
  const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    streaming: true,
  })

  const vectorStore = PrismaVectorStore.withModel(db).create(
    new OpenAIEmbeddings(),
    {
      prisma: Prisma,
      tableName: 'Article',
      vectorColumnName: 'vector',
      columns: {
        external_id: PrismaVectorStore.IdColumn,
        summary: PrismaVectorStore.ContentColumn,
      },
    },
  )

  const savedDocs = await db.article.findMany({
    where: {
      external_id: {
        in: articles.map(({ _id }) => _id),
      },
    },
  })

  const unsavedDocs = await db.$transaction(
    articles
      .filter(
        ({ _id }) => !savedDocs.find(({ external_id }) => external_id === _id),
      )
      .map(({ _id, _score, published_date, ...rest }) =>
        db.article.create({
          data: {
            ...rest,
            external_id: _id,
            external_score: _score,
            published_date: new Date(published_date),
          },
        }),
      ),
  )

  await vectorStore.addModels([...savedDocs, ...unsavedDocs])

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(1),
  )

  return chain
}
