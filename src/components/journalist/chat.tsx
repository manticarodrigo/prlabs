// import { useUser } from '@clerk/nextjs'
import { Message } from 'ai'
import autosize from 'autosize'
import { Bot, Loader2, RefreshCw, Send, StopCircle, User } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Author } from '@/lib/drizzle'
import { cn } from '@/lib/utils'

type JournalistChatProps = {
  author: Author
  formRef: React.RefObject<HTMLFormElement>
  inputRef: React.RefObject<HTMLTextAreaElement>
  buttonRef: React.RefObject<HTMLButtonElement>
  input: string
  messages: Message[]
  isLoading: boolean
  stop: () => void
  reload: () => void
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function JournalistChat({
  author,
  formRef,
  inputRef,
  buttonRef,
  input,
  messages,
  isLoading,
  stop,
  reload,
  handleInputChange,
  handleSubmit,
}: JournalistChatProps) {
  const { user } = {} // useUser()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      autosize(inputRef.current)
    }
  }, [inputRef])

  return (
    <section className="flex flex-col w-full h-full">
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
    </section>
  )
}
