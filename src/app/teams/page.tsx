import { currentUser } from '@clerk/nextjs'
import invariant from 'tiny-invariant'

import { getTeams } from '@/app/api/team/model'
import { TeamList } from '@/components/team/list'

export default async function TeamListPage() {
  const user = await currentUser()

  invariant(user, 'No user found.')

  const teams = await getTeams(user.id)

  return (
    <main className="container flex flex-col py-6 px-4 w-full h-full gap-4 sm:gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back {user.firstName}!
        </h1>
        <p className="text-muted-foreground">Select a team to get started.</p>
      </div>
      <TeamList teams={teams} />
    </main>
  )
}
