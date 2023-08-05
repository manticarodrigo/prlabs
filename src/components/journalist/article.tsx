import { useCompletion } from 'ai/react'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Article, ArticleAnalysis } from '@/lib/drizzle'

type JournalistArticleProps = {
  article: Article & { analyses?: ArticleAnalysis[] }
}

export function JournalistArticle({ article }: JournalistArticleProps) {
  const { completion, isLoading, complete } = useCompletion({
    api: '/api/article',
  })

  return (
    <article className="w-full">
      <Dialog>
        <DialogTrigger className="w-full text-left">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">{article.title}</CardTitle>
              <CardDescription>
                {dayjs(article.published_date).format('MMMM D, YYYY')}
              </CardDescription>
            </CardHeader>
            <CardContent>{article.excerpt}</CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="pr-4">{article.title}</DialogTitle>
            <DialogDescription>
              {dayjs(article.published_date).format('MMMM D, YYYY')}
            </DialogDescription>
          </DialogHeader>
          <Tabs>
            <TabsList>
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="original" className="border-t">
              <p className="py-4 max-h-[50vh] overflow-auto">
                {article.summary || article.excerpt}
              </p>
              <DialogFooter className="border-t pt-4">
                <Button asChild>
                  <a
                    href={article.link ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link to source
                  </a>
                </Button>
                <Button asChild>
                  <DialogTrigger>Done</DialogTrigger>
                </Button>
              </DialogFooter>
            </TabsContent>
            <TabsContent value="analysis" className="border-t">
              <p className="py-4 max-h-[50vh] overflow-auto whitespace-pre-wrap">
                {completion || isLoading ? (
                  <>
                    {completion}
                    {isLoading && (
                      <>
                        <br /> Loading...
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {(article.analyses ?? [])[0]?.content ||
                      'No analysis found.'}
                  </>
                )}
              </p>
              <DialogFooter className="border-t pt-4">
                <Button
                  onClick={() => {
                    complete(article.id)
                  }}
                >
                  Generate Analysis
                </Button>
                <Button asChild>
                  <DialogTrigger>Done</DialogTrigger>
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </article>
  )
}
