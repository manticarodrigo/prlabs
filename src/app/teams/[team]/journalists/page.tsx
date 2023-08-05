import { currentUser } from '@clerk/nextjs'
import invariant from 'tiny-invariant'

import { JournalistSearch } from '@/components/journalist/search'
import { db, schema } from '@/lib/drizzle'

interface Props {
  params: {
    team: string
  }
}

export default async function JournalistsPage({ params }: Props) {
  const [user, authors] = await Promise.all([
    currentUser(),
    db.select().from(schema.author),
  ])

  invariant(user, 'User not found')

  return (
    <main className="flex flex-col lg:justify-center items-center py-4 px-2 w-full h-full">
      <section className="flex flex-col justify-center items-center max-w-xl w-full space-y-4">
        <header>
          <h1 className="text-lg text-center font-medium">
            Welcome back {user.firstName}!
          </h1>
          <p className="text-muted-foreground">Choose a journalist to begin.</p>
        </header>
        <div className="rounded-lg border w-full shadow-md">
          <JournalistSearch team={params.team} authors={authors} />
        </div>
      </section>
    </main>
  )
}
