import prisma from '@/lib/prisma'
import { Link } from 'lucide-react'

export default async function JournalistArticlesPage({ params }) {
  const { id } = params

  const author = await prisma.author.findUnique({
    where: { id },
    include: { articles: true },
  })

  const { articles } = author

  return (
    <ul className="space-y-2">
      {articles.map((article) => {
        const { id, title, link, excerpt } = article
        return (
          <li key={id} className="rounded border border-slate-900 p-2">
            <article>
              <div className="flex items-center">
                <h1 className="font-medium">{title}</h1>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1"
                >
                  <span className="sr-only">Link to article</span>
                  <Link size={16} className="text-blue-600" />
                </a>
              </div>
              <p className="text-sm">{excerpt}</p>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
