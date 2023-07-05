import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Prompt } from '@/lib/notion'

type JournalistPromptProps = {
  prompt: Prompt
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export function JournalistPrompt({ prompt, onClick }: JournalistPromptProps) {
  return (
    <article className="w-full">
      <button className="w-full text-left" onClick={onClick}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">{prompt.name}</CardTitle>
          </CardHeader>
          <CardContent>{prompt.description}</CardContent>
        </Card>
      </button>
    </article>
  )
}
