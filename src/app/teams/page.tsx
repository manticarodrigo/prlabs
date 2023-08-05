import { currentUser } from '@clerk/nextjs'
import invariant from 'tiny-invariant'

import { getTeams } from '@/app/api/team/model'
import { TeamList } from '@/components/team/list'
import { TeamModal } from '@/components/team/modal'

const teams = [
  ['Apple', 'Think different.'],
  ['Google', 'Organizing the world’s information.'],
  ['Facebook', 'Connecting the world.'],
  ['Amazon', 'Delivering smiles.'],
  [
    'Microsoft',
    'Empowering every person and every organization on the planet to achieve more.',
  ],
  ['Netflix', 'Entertainment, anywhere, anytime.'],
  ['Tesla', 'Accelerating the world’s transition to sustainable energy.'],
  [
    'Twitter',
    'Giving everyone the power to create and share ideas and information instantly, without barriers.',
  ],
  ['Uber', 'Igniting opportunity by setting the world in motion.'],
  ['Airbnb', 'Belong anywhere.'],
]

interface Props {
  searchParams?: {
    team: string
  }
}

export default async function TeamListPage({ searchParams }: Props) {
  const { team: teamId } = searchParams ?? {}
  const user = await currentUser()

  invariant(user, 'No user found.')

  const teams = await getTeams(user.id)
  const team = teams.find((team) => team.id === teamId)

  return (
    <main className="container flex flex-col py-6 px-4 w-full h-full gap-4 sm:gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back {user.firstName}!
        </h1>
        <p className="text-muted-foreground">Select a team to get started.</p>
      </div>
      <TeamList teams={teams} />
      <TeamModal team={team} />
    </main>
  )
}
