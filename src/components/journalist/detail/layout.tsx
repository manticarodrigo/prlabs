'use client'

import { useChat } from 'ai/react'
import autosize from 'autosize'
import dayjs from 'dayjs'
import { Bot, Send, User } from 'lucide-react'
import { useEffect, useRef } from 'react'

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
import { Textarea } from '@/components/ui/textarea'
import { Article, Author } from '@/lib/prisma'
import { cn } from '@/lib/utils'

export function JournalistDetailLayout({
  author,
  prompts,
}: {
  author: Author & { articles: Article[] }
  prompts: { id: string; name: string; prompt: string }[]
}) {
  const { articles } = author

  const { messages, input, setInput, handleInputChange, handleSubmit } =
    useChat({
      body: {
        interviewer: author.name,
        outlet: author.outlet,
      },
    })

  const formRef = useRef(null)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      autosize(inputRef.current)
    }
  }, [inputRef])

  const twitter = articles
    .find((article) => article.twitter_account)
    .twitter_account.replace('@', '')

  return (
    <div className="flex flex-col lg:flex-row w-full h-full">
      <aside className="flex flex-col w-full h-full lg:max-w-sm md:border-r">
        <Tabs
          defaultValue="prompts"
          className="flex flex-col w-full h-full min-h-0"
        >
          <header className="p-2 w-full">
            <h1 className="text-xl font-bold">{author.name}</h1>
            <h2 className="text-sm">
              {twitter && (
                <a
                  className="text-blue-500"
                  href={`https://twitter.com/${twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{twitter}
                </a>
              )}
              {twitter && author.outlet && ' | '}
              {author.outlet && (
                <a
                  className="text-blue-500"
                  href={`https://${author.outlet}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {author.outlet}
                </a>
              )}
            </h2>
            <TabsList className="mt-2">
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
            </TabsList>
          </header>
          <TabsContent
            value="prompts"
            className="border-t w-full h-full min-h-0"
          >
            <ul className="space-y-2 p-2 w-full h-full min-h-0 overflow-auto">
              {prompts.map((prompt) => {
                return (
                  <li key={prompt.id}>
                    <article>
                      <button
                        className="text-left"
                        onClick={() => {
                          setInput(
                            prompt.prompt
                              .replace('{interviewer}', author.name)
                              .replace('{outlet}', author.outlet),
                          )
                          setTimeout(() => {
                            if (inputRef.current) {
                              autosize.update(inputRef.current)
                            }
                          })
                        }}
                      >
                        <Card className="w-full">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              {prompt.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {prompt.prompt
                              .replace('{interviewer}', author.name)
                              .replace('{outlet}', author.outlet)
                              .substring(0, 100)}
                            ...
                          </CardContent>
                        </Card>
                      </button>
                    </article>
                  </li>
                )
              })}
            </ul>
          </TabsContent>
          <TabsContent
            value="articles"
            className="border-t w-full h-full min-h-0"
          >
            <ul className="space-y-2 p-2 w-full h-full min-h-0 overflow-auto">
              {articles.map((article) => {
                return (
                  <li key={article.id}>
                    <article>
                      <Dialog>
                        <DialogTrigger className="text-left">
                          <Card className="w-full">
                            <CardHeader>
                              <CardTitle className="text-lg">
                                {article.title}
                              </CardTitle>
                              <CardDescription>
                                {dayjs(article.published_date).format(
                                  'MMMM D, YYYY',
                                )}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>{article.excerpt}</CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="pr-4">
                              {article.title}
                            </DialogTitle>
                            <DialogDescription>
                              {dayjs(article.published_date).format(
                                'MMMM D, YYYY',
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <p className="max-h-[50vh] overflow-auto">
                            {article.summary || article.excerpt}
                          </p>
                          <DialogFooter>
                            <Button asChild color="blue">
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
                        </DialogContent>
                      </Dialog>
                    </article>
                  </li>
                )
              })}
            </ul>
          </TabsContent>
        </Tabs>
      </aside>
      <main className="flex flex-col w-full h-full">
        <div className="divide-y w-full h-full min-h-0 overflow-auto">
          {messages.map((m) => {
            return (
              <div
                key={m.id}
                className={cn('px-2 py-4 whitespace-pre-wrap', {
                  'bg-slate-100': m.role === 'user',
                })}
              >
                <div className="flex items-start mx-auto w-full max-w-2xl">
                  <div className="rounded-full p-2 mr-4 bg-foreground">
                    <span className="text-background">
                      {m.role === 'user' ? <User /> : <Bot />}
                    </span>
                  </div>
                  <div>{m.content}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="p-2 w-full">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative mx-auto w-full max-w-2xl"
          >
            <Textarea
              rows={1}
              ref={inputRef}
              value={input}
              placeholder="Chat with journalist..."
              className="pr-16 min-h-[2.5rem] max-h-32 resize-none shadow-xl"
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (
                  buttonRef.current &&
                  e.key === 'Enter' &&
                  e.shiftKey == false
                ) {
                  e.preventDefault()
                  buttonRef.current.click()
                }
              }}
            />
            <Button ref={buttonRef} aria-label="Submit" className="mt-4 w-full">
              <Send className="mr-2 w-4 h-4" />
              Send message
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
