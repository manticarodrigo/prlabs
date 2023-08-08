import invariant from 'tiny-invariant'

import { processArticles } from '@/app/api/article/model'
import { getTeam } from '@/app/api/team/model'
import { ArticleCard } from '@/components/article/card'
import { Badge } from '@/components/ui/badge'
import { getTopicArticles } from '@/lib/newscatcher'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Props {
  params: {
    team: string
  }
}

export default async function JournalistsPage({ params }: Props) {
  const team = await getTeam(params.team)

  invariant(team, 'Team not found')

  const {
    total_hits,
    page_size,
    articles: topicArticles,
  } = await getTopicArticles(team.keywords.map((k) => k.name))
  const processedArticles = await processArticles(team, topicArticles)

  const hits = Math.min(100, page_size)

  const articles = processedArticles
    ?.sort((a, b) => b.analysis.score - a.analysis.score)
    .slice(0, hits)

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
    .slice(0, 50)
    .map(([name, { count, outlet }]) => ({
      name,
      count,
      outlet,
    }))

  return (
    <main className="container flex flex-col py-6 px-4 w-full min-h-full gap-4 sm:gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>
        <ul className="flex flex-wrap gap-2">
          {team.keywords.map((k) => (
            <Badge key={k.id} variant="secondary">
              {k.name}
            </Badge>
          ))}
        </ul>
        <p className="text-muted-foreground">{team.description}</p>
        <p className="text-muted-foreground">{team.strategy}</p>
      </div>
      <div>
        <h2 className="text-lg font-bold tracking-tight">Journalists</h2>
        <p className="text-muted-foreground">
          Most frequently mentioned journalists.
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {topJournalists.map((j) => (
          <li key={j.name}>
            <Badge variant="outline">
              {j.name} ({j.count})
            </Badge>
          </li>
        ))}
      </ul>
      <div>
        <h2 className="text-lg font-bold tracking-tight">Articles</h2>
        <p className="text-muted-foreground">
          Top {hits} relevant articles ({total_hits} total matches).
        </p>
      </div>
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {articles?.map((article) => (
          <li key={article._id}>
            <ArticleCard
              article={article}
              className="flex flex-col justify-between"
            >
              <ul className="flex flex-col gap-2">
                {article.analysis.themes.map((t, i) => (
                  <li key={i}>
                    <div className="text-sm font-medium">{t.title}</div>
                    <div className="text-xs">{t.headline}</div>
                  </li>
                ))}
              </ul>
            </ArticleCard>
          </li>
        ))}
      </ul>
    </main>
  )
}
