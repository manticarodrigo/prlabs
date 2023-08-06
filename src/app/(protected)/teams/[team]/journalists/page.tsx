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
        <p className="text-muted-foreground">
          Here are the latest articles for your team based on your keywords:
        </p>
      </div>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {articles?.map((article) => (
          <li key={article._id}>
            <ArticleCard article={article} className="flex flex-col justify-between h-full max-h-[300]" />
          </li>
        ))}
      </ul>
    </main>
  )
}
