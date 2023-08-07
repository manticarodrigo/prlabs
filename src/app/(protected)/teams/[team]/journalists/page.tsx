import { currentUser } from '@clerk/nextjs'
import invariant from 'tiny-invariant'

import { getTeam } from '@/app/api/team/model'
import { ArticleCard } from '@/components/article/card'
import { Badge } from '@/components/ui/badge'
import { getTopicArticles } from '@/lib/newscatcher'

interface Props {
  params: {
    team: string
  }
}

export default async function JournalistsPage({ params }: Props) {
  const [user, team] = await Promise.all([currentUser(), getTeam(params.team)])

  invariant(user, 'User not found')
  invariant(team, 'Team not found')

  const articles = await getTopicArticles(
    team.keywords.map((k) => k.name) ?? [],
  )

  const topJournalistsMap = articles
    ?.map((a) => ({ author: a.author, outlet: a.clean_url }))
    .reduce((acc, curr) => {
      if (acc[curr.author]) {
        acc[curr.author].count++
      } else {
        acc[curr.author] = {
          count: 1,
          outlet: curr.outlet ?? '',
        }
      }
      return acc
    }, {} as Record<string, { count: number; outlet: string }>)

  const topJournalists = Object.entries(topJournalistsMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name, { count, outlet }]) => ({
      name,
      count,
      outlet,
    }))

  return (
    <main className="container flex flex-col py-6 px-4 w-full min-h-full gap-4 sm:gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>
        <ul className="flex flex-wrap gap-2">
          {team.keywords.map((k) => (
            <Badge key={k.id} variant="secondary">
              {k.name}
            </Badge>
          ))}
        </ul>
      </div>
      <h2 className="text-lg font-bold tracking-tight">Journalists</h2>
      <ul className="flex flex-wrap gap-2">
        {topJournalists.map((j) => (
          <li key={j.name}>
            <Badge>
              {j.name} ({j.count})
            </Badge>
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-bold tracking-tight">Articles</h2>
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {articles?.map((article) => (
          <li key={article._id}>
            <ArticleCard
              article={article}
              className="flex flex-col justify-between h-full max-h-[300]"
            />
          </li>
        ))}
      </ul>
    </main>
  )
}
