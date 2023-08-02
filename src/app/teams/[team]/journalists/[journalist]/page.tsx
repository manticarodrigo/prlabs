import { JournalistDetail } from '@/app/teams/[team]/journalists/[journalist]/detail'
import { db, desc, eq, schema } from '@/lib/drizzle'
import { getNotionPrompts } from '@/lib/notion'

export default async function JournalistDetailPage({ params }) {
  const { journalist } = params

  const [prompts, author] = await Promise.all([
    getNotionPrompts(),
    db.query.author.findFirst({
      where: eq(schema.author.id, journalist),
      with: {
        articles: {
          orderBy: [desc(schema.article.published_date)],
          with: {
            analyses: {
              limit: 1,
              orderBy: [desc(schema.articleAnalysis.createdAt)],
            },
          },
        },
      },
    }),
  ])

  return <JournalistDetail author={author} prompts={prompts} />
}
