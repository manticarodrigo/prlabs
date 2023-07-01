'use client'

import { useCompletion } from 'ai/react'

import { Button } from '@/components/ui/button'

export default function JournalistAnalysisPage({ params }) {
  const { id } = params

  const { completion, isLoading, complete } = useCompletion({
    api: '/api/journalist',
  })

  return (
    <main className="p-2 space-y-4">
      <h1>Journalist Analysis</h1>
      <p>{isLoading && 'Loading...'}</p>
      <p className="whitespace-pre-wrap">{completion}</p>
      <Button
        onClick={() => {
          complete(id)
        }}
      >
        Generate Analysis
      </Button>
    </main>
  )
}
