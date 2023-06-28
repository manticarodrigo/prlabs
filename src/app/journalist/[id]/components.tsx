'use client'

import { useChat } from 'ai/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Article, Author } from '@/lib/prisma'
import { cn } from '@/lib/utils'
import autosize from 'autosize'
import { Bot, Send, User } from 'lucide-react'
import { useEffect, useRef } from 'react'

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
  return (
    <div className="flex flex-col lg:flex-row w-full h-full">
      <aside className="flex flex-col w-full h-full lg:max-w-sm md:border-r">
        <Tabs
          defaultValue="prompts"
          className="flex flex-col w-full h-full min-h-0"
        >
          <header className="p-2 w-full">
            <h1 className="text-xl font-bold">{author.name}</h1>
            <h2 className="text-lg">{author.outlet}</h2>
            <TabsList className="mt-4">
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
            </TabsList>
          </header>
          <TabsContent value="prompts" className="w-full h-full min-h-0">
            <ul className="space-y-2 p-2 w-full h-full min-h-0 overflow-auto">
              {prompts.map((prompt) => {
                return (
                  <li key={prompt.id}>
                    <article>
                      <Card
                        className="w-full cursor-pointer"
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
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {prompt.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {prompt.prompt.substring(0, 100)}...
                        </CardContent>
                      </Card>
                    </article>
                  </li>
                )
              })}
            </ul>
          </TabsContent>
          <TabsContent value="articles" className="w-full h-full min-h-0">
            <ul className="space-y-2 p-2 w-full h-full min-h-0 overflow-auto">
              {articles.map((article) => {
                return (
                  <li key={article.id}>
                    <article>
                      <Card className="w-full">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            <a
                              href={article.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {article.title}
                            </a>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{article.excerpt}</CardContent>
                      </Card>
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
