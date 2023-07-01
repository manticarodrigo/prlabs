import { JournalistDetailComponent } from '@/app/journalist/[id]/component'
import { getNotionPrompts } from '@/lib/notion'
import prisma from '@/lib/prisma'

export default async function JournalistDetailPage({ params }) {
  const { id } = params

  const [prompts, author] = await Promise.all([
    getNotionPrompts(),
    prisma.author.findUnique({
      where: { id },
      include: {
        articles: {
          orderBy: { published_date: 'desc' },
          include: {
            analyses: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    }),
  ])

  return <JournalistDetailComponent author={author} prompts={prompts} />
}
