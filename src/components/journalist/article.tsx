import { ArticleAnalysis } from '@prisma/client'
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
import { Article } from '@/lib/prisma'

export function JournalistArticle({
  article,
}: {
  article: Article & { analyses?: ArticleAnalysis[] }
}) {
  const { completion, isLoading, complete } = useCompletion({
    api: '/api/article',
  })

  return (
    <article>
      <Dialog>
        <DialogTrigger className="text-left">
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
              <p className="max-h-[50vh] overflow-auto">
                {article.summary || article.excerpt}
              </p>
              <DialogFooter>
                <Button asChild>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link to source
                  </a>
                </Button>
                <DialogTrigger>
                  <Button>Done</Button>
                </DialogTrigger>
              </DialogFooter>
            </TabsContent>
            <TabsContent value="analysis" className="border-t">
              <p className="max-h-[50vh] overflow-auto whitespace-pre-wrap">
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
                  <>{article.analyses[0]?.content || 'No analysis found.'}</>
                )}
              </p>
              <DialogFooter>
                <Button
                  onClick={() => {
                    complete(article.id)
                  }}
                >
                  Generate Analysis
                </Button>
                <DialogTrigger>
                  <Button>Done</Button>
                </DialogTrigger>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </article>
  )
}
