import { Author } from '@prisma/client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Prompt } from '@/lib/notion'

type JournalistPromptProps = {
  author: Author
  prompt: Prompt
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export function JournalistPrompt({
  author,
  prompt,
  onClick,
}: JournalistPromptProps) {
  return (
    <article>
      <button className="text-left" onClick={onClick}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">{prompt.name}</CardTitle>
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
  )
}
