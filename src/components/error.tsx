import { RefreshCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-4 w-full min-h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-lg text-muted-foreground">{error.message}</p>
      </div>
      <Button onClick={() => reset()}>
        <RefreshCcw className="w-4 h-4 mr-2" />
        Try again
      </Button>
    </div>
  )
}
