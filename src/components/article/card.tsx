import dayjs from 'dayjs'
import Image from 'next/image'

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
  article: (Article | NewsCatcherArticle) & { analysis?: { score: number } }
}

export function ArticleCard({
  article,
  children,
  ...props
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card {...props} className={props.className + ' relative pt-8'}>
      <CardHeader>
        {!!article.analysis && (
          <div className="absolute top-0 right-0 p-2">
            <Badge variant="outline">
              Relevance: {article.analysis.score}%
            </Badge>
          </div>
        )}
        {!!article.media && (
          <div className="w-full">
            <Image
              src={article.media}
              alt="Article media"
              width={300}
              height={200}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}
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
      <CardContent>{children || article.summary}</CardContent>
      <CardFooter>
        {dayjs(article.published_date).format('MMMM D, YYYY')}
      </CardFooter>
    </Card>
  )
}
