import { getNotionPrompts } from '@/lib/notion'
import prisma from '@/lib/prisma'
import { JournalistDetailLayout } from './components'

export default async function JournalistDetailPage({ params }) {
  const { id } = params

  const [prompts, author] = await Promise.all([
    getNotionPrompts(),
    prisma.author.findUnique({
      where: { id },
      include: { articles: true },
    }),
  ])

  return <JournalistDetailLayout author={author} prompts={prompts} />
}
