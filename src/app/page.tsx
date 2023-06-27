import JournalistSearch from '@/components/journalist/search'
import prisma from '@/lib/prisma'

export default async function Home() {
  const authors = await prisma.author.findMany()

  return (
    <main className="flex flex-col justify-center items-center w-full h-full">
      <div className="rounded-lg max-w-xl w-full shadow-lg">
        <JournalistSearch authors={authors} />
      </div>
    </main>
  )
}
