import { useUser } from '@clerk/nextjs'
import { Hammer, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Author } from '@/lib/drizzle'

type JournalistPrepareProps = {
  author: Author
}

function prepare({ id }) {
  return fetch('/api/journalist/prepare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
}

export function JournalistPrepare({ author }: JournalistPrepareProps) {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <section className="flex items-center justify-center w-full h-full">
      <div className="flex justify-center items-center w-full h-full min-h-0">
        <article className="rounded-lg border p-4 text-center max-w-md shadow-lg space-y-2">
          <h2 className="text-2xl font-medium">
            Hi, {user?.firstName || 'friend'}!
          </h2>
          <p>
            I&apos;m a bot that reads and analyzes {author.name}&apos;s recent
            articles.
          </p>
          <p>
            We need some time to prepare the data. This should take about a
            minute. Please press the button below to begin.
          </p>
          <Button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              await prepare(author)
              window.location.reload()
            }}
          >
            {isLoading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <Hammer className="mr-2 w-4 h-4" />
            )}
            Prepare context
          </Button>
        </article>
      </div>
    </section>
  )
}
