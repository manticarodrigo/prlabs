import dayjs from 'dayjs'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Article } from '@/lib/drizzle'
import { NewsCatcherArticle } from '@/lib/newscatcher'

interface Props {
  article: Article | NewsCatcherArticle
}

export function ArticleCard({
  article,
  ...props
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card {...props}>
      <CardHeader>
        <div className="text-sm text-muted-foreground">
          {article.clean_url} <Badge variant="secondary">{article.topic}</Badge>
        </div>
        <CardTitle className="line-clamp-2">
          <div className="text-lg">{article.title}</div>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {article.authors?.split(',').join(', ')}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 h-full line-clamp-4">
        {article.summary}
      </CardContent>
      <CardFooter className="p-6">
        {dayjs(article.published_date).format('MMMM D, YYYY')}
      </CardFooter>
    </Card>
  )
}
