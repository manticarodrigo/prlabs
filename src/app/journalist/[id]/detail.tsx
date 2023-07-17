'use client'

import { useUser } from '@clerk/nextjs'
import { useChat } from 'ai/react'
import autosize from 'autosize'
import { Bot, Loader2, RefreshCw, Send, StopCircle, User } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { JournalistSidebar } from '@/components/journalist/sidebar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { AuthorWithArticlesWithAnalyses } from '@/lib/drizzle'
import { Prompt } from '@/lib/notion'
import { cn } from '@/lib/utils'

type JournalistDetailProps = {
  author: AuthorWithArticlesWithAnalyses
  prompts: Prompt[]
}

export function JournalistDetail({ author, prompts }: JournalistDetailProps) {
  const { toast } = useToast()
  const { user } = useUser()

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
  } = useChat({
    api: '/api/journalist',
    body: {
      id: author.id,
    },
    onResponse(response) {
      if (response.status >= 400) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        })
      }
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
      <JournalistSidebar
        author={author}
        prompts={prompts}
        onClickPrompt={(prompt) => {
          setInput(
            prompt.prompt
              .replace(/{interviewer}/g, author.name)
              .replace(/{outlet}/g, author.outlet),
          )
          setTimeout(() => {
            if (inputRef.current) {
              autosize.update(inputRef.current)
            }
          })
        }}
      />
      <main className="flex flex-col w-full h-full">
        <div className="divide-y w-full h-full min-h-0 overflow-auto">
          {messages.length === 0 && (
            <div className="flex justify-center items-center w-full h-full min-h-0">
              <article className="rounded-lg border p-4 text-center max-w-md shadow-lg space-y-2">
                <h2 className="text-2xl font-medium">
                  Hi, {user?.firstName || 'friend'}!
                </h2>
                <p>
                  I&apos;m a bot that has read and analyzed {author.name}&apos;s
                  recent articles.
                </p>
                <p>
                  Ask me anything, or choose from our curated workflows in the
                  sidebar.
                </p>
              </article>
            </div>
          )}
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
        <div className="border-t p-2 w-full">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative mx-auto w-full max-w-2xl space-y-2"
          >
            <div className="flex justify-center w-full">
              {!!isLoading ? (
                <Button onClick={() => stop()}>
                  <StopCircle className="mr-2 w-4 h-4" />
                  Stop generating
                </Button>
              ) : (
                <>
                  {messages?.length > 0 && (
                    <Button onClick={() => reload()}>
                      <RefreshCw className="mr-2 w-4 h-4" />
                      Regenerate response
                    </Button>
                  )}
                </>
              )}
            </div>
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
            <Button
              ref={buttonRef}
              type="submit"
              disabled={isLoading}
              aria-label="Submit"
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                <Send className="mr-2 w-4 h-4" />
              )}
              Send message
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
