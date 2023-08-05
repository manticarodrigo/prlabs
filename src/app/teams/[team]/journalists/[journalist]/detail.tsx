'use client'

import { useChat } from 'ai/react'
import autosize from 'autosize'
import { useRef } from 'react'

import { JournalistChat } from '@/components/journalist/chat'
import { JournalistPrepare } from '@/components/journalist/prepare'
import { JournalistSidebar } from '@/components/journalist/sidebar'
import { useToast } from '@/components/ui/use-toast'
import { AuthorWithArticlesWithAnalyses } from '@/lib/drizzle'
import { Prompt } from '@/lib/notion'
import { onErrorToast } from '@/util/toast'

type JournalistDetailProps = {
  author: AuthorWithArticlesWithAnalyses
  prompts: Prompt[]
}

export function JournalistDetail({ author, prompts }: JournalistDetailProps) {
  const { toast } = useToast()

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
        onErrorToast()
      }
    },
  })

  const formRef = useRef(null)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  const hasAnalysesForLastTenArticles = author.articles
    .slice(0, 10)
    .every((article) => article.analyses.length > 0)

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
      <main className="w-full h-full">
        {hasAnalysesForLastTenArticles ? (
          <JournalistChat
            author={author}
            formRef={formRef}
            inputRef={inputRef}
            buttonRef={buttonRef}
            input={input}
            messages={messages}
            isLoading={isLoading}
            stop={stop}
            reload={reload}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        ) : (
          <JournalistPrepare author={author} />
        )}
      </main>
    </div>
  )
}
