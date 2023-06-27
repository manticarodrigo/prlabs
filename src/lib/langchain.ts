import { OpenAI } from 'langchain/llms/openai'
import { RetrievalQAChain, loadQARefineChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PrismaVectorStore } from 'langchain/vectorstores/prisma'
import { Prisma } from '@prisma/client/edge'

import db from '@/lib/prisma'

export async function makeRetrievalQAChain(articles) {
  const model = new OpenAI({
    modelName: 'gpt-3.5-turbo-16k',
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

  const unsavedArticles = articles.filter(
    ({ _id }) => !savedDocs.find(({ external_id }) => external_id === _id),
  )

  const unsavedDocs = await db.$transaction(
    unsavedArticles.map(({ _id, _score, published_date, author, ...rest }) =>
      db.article.create({
        data: {
          ...rest,
          external_id: _id,
          external_score: _score,
          published_date: new Date(published_date),
          author: {
            connectOrCreate: {
              where: {
                name_outlet: {
                  name: author,
                  outlet: rest.rights,
                },
              },
              create: {
                name: author,
                outlet: rest.rights,
              },
            },
          },
        },
      }),
    ),
  )

  await vectorStore.addModels([...savedDocs, ...unsavedDocs])

  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQARefineChain(model),
    retriever: vectorStore.asRetriever(),
  })

  return chain
}
