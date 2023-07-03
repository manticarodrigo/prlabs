import { JournalistDetail } from '@/app/journalist/[id]/detail'
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

  return <JournalistDetail author={author} prompts={prompts} />
}
