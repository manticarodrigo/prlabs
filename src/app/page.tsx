import { JournalistSearch } from '@/components/journalist/search'
import { db, schema } from '@/lib/drizzle'

export const runtime = 'edge'

export default async function HomePage() {
  const authors = await db.select().from(schema.author)

  return (
    <main className="flex flex-col justify-center items-center p-2 w-full h-full">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-lg text-center font-medium">
          Choose a journalist to begin your workflow.
        </h1>
        <div className="rounded-lg border w-full shadow-md">
          <JournalistSearch authors={authors} />
        </div>
      </div>
    </main>
  )
}
