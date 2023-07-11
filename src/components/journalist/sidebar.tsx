'use client'

import { Menu } from 'lucide-react'

import { JournalistArticle } from '@/components/journalist/article'
import { JournalistPrompt } from '@/components/journalist/prompt'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Author, AuthorWithArticlesWithAnalyses } from '@/lib/drizzle'
import { Prompt } from '@/lib/notion'

type JournalistSidebarProps = {
  author: AuthorWithArticlesWithAnalyses
  prompts: Prompt[]
  onClickPrompt: (prompt: Prompt) => void
}

function JournalistSubtitle({ author }: { author: Author }) {
  return (
    <a
      className="text-blue-500"
      href={`https://${author.outlet}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {author.outlet}
    </a>
  )
}

function JournalistSidebarTabs({
  author,
  prompts,
  onClickPrompt,
}: JournalistSidebarProps) {
  const { articles } = author
  return (
    <Tabs
      defaultValue="prompts"
      className="flex flex-col items-center lg:items-start w-full h-full min-h-0"
    >
      <div className="px-2">
        <TabsList>
          <TabsTrigger value="prompts">Workflows</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="prompts" className="border-t w-full h-full min-h-0">
        <ul className="space-y-2 p-2 w-full h-full min-h-0 overflow-auto">
          {prompts.map((prompt) => {
            return (
              <li key={prompt.id}>
                <JournalistPrompt
                  prompt={prompt}
                  onClick={() => {
                    onClickPrompt(prompt)
                  }}
                />
              </li>
            )
          })}
        </ul>
      </TabsContent>
      <TabsContent value="articles" className="border-t w-full h-full min-h-0">
        <ul className="space-y-2 p-2 w-full h-full min-h-0 overflow-auto">
          {articles.map((article) => {
            return (
              <li key={article.id}>
                <JournalistArticle article={article} />
              </li>
            )
          })}
        </ul>
      </TabsContent>
    </Tabs>
  )
}

export function JournalistTabSheet({
  author,
  prompts,
  onClickPrompt,
}: JournalistSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          aria-label="Open context menu"
          className="mr-2"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col items-center lg:items-start">
        <SheetHeader className="p-2 sm:text-center lg:text-left">
          <SheetTitle>{author.name}</SheetTitle>
          <SheetDescription>
            <JournalistSubtitle author={author} />
          </SheetDescription>
        </SheetHeader>
        <div className="border-b w-full h-full min-h-0">
          <JournalistSidebarTabs
            author={author}
            prompts={prompts}
            onClickPrompt={onClickPrompt}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function JournalistSidebar({
  author,
  prompts,
  onClickPrompt,
}: JournalistSidebarProps) {
  return (
    <aside className="flex flex-col w-full h-full lg:max-w-sm md:border-r">
      <header className="flex items-center border-b lg:border-none p-2 w-full">
        <div className="lg:hidden">
          <JournalistTabSheet
            author={author}
            prompts={prompts}
            onClickPrompt={onClickPrompt}
          />
        </div>
        <div>
          <h1 className="text-xl font-bold">{author.name}</h1>
          <h2 className="text-sm">
            <JournalistSubtitle author={author} />
          </h2>
        </div>
      </header>
      <div className="hidden lg:block w-full h-full min-h-0">
        <JournalistSidebarTabs
          author={author}
          prompts={prompts}
          onClickPrompt={onClickPrompt}
        />
      </div>
    </aside>
  )
}
