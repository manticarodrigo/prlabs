import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getNotionPrompts } from '@/lib/notion'
import prisma from '@/lib/prisma'

export default async function JournalistLayout({ params, children }) {
  const { id } = params

  const [prompts, author] = await Promise.all([
    getNotionPrompts(),
    prisma.author.findUnique({
      where: { id },
      include: { articles: true },
    }),
  ])

  const { name, outlet, articles } = author

  return (
    <div className="flex flex-col sm:flex-row w-full h-full">
      <aside className="flex flex-col w-full h-full max-w-sm md:border-r">
        <Tabs
          defaultValue="prompts"
          className="flex flex-col w-full h-full min-h-0"
        >
          <header className="p-2 w-full">
            <h1 className="text-xl font-bold">{name}</h1>
            <h2 className="text-lg">{outlet}</h2>
            <TabsList className="mt-4">
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
            </TabsList>
          </header>
          <TabsContent value="prompts" className="w-full h-full min-h-0">
            <ul className="space-y-2 p-2 w-full h-full min-h-0 overflow-auto">
              {prompts.map(({ id, name, prompt }) => {
                return (
                  <li key={id}>
                    <article>
                      <Card className="w-full">
                        <CardHeader>
                          <CardTitle className="text-lg">{name}</CardTitle>
                        </CardHeader>
                        <CardContent>{prompt.substring(0, 100)}...</CardContent>
                      </Card>
                    </article>
                  </li>
                )
              })}
            </ul>
          </TabsContent>
          <TabsContent value="articles" className="w-full h-full min-h-0">
            <ul className="space-y-2 p-2 w-full h-full min-h-0 overflow-auto">
              {articles.map(({ id, title, link, excerpt }) => {
                return (
                  <li key={id}>
                    <article>
                      <Card className="w-full">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {title}
                            </a>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{excerpt}</CardContent>
                      </Card>
                    </article>
                  </li>
                )
              })}
            </ul>
          </TabsContent>
        </Tabs>
      </aside>
      {children}
    </div>
  )
}
