import { currentUser } from '@clerk/nextjs'

import { getTeams } from '@/app/api/team/model'
import { TeamSearch } from '@/components/team/search'

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

function genTeams() {
  const timestamp = new Date().toISOString()
  return teams.map(([name, description], i) => ({
    id: `${i}`,
    userId: `${i}`,
    name,
    slug: '',
    description,
    strategy: '',
    updatedAt: timestamp,
    createdAt: timestamp,
  }))
}

export default async function TeamListPage() {
  const user = await currentUser()

  const teams = user ? await getTeams(user.id) : genTeams()

  return (
    <main className="flex flex-col lg:justify-center items-center py-4 px-2 w-full h-full">
      <section className="flex flex-col justify-center items-center max-w-xl w-full space-y-4">
        <header>
          <h1 className="text-lg text-center font-medium">
            Welcome back {user?.firstName ?? 'friend'}!
          </h1>
          <p className="text-muted-foreground">Choose a team to continue.</p>
        </header>
        <div className="rounded-lg border w-full shadow-md">
          <TeamSearch teams={teams} />
        </div>
      </section>
    </main>
  )
}
