'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { postJournalist } from '@/app/api/journalist/actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { InputWithLabel } from '@/components/ui/input'

export default function JournalistCreatePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <main className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col justify-center items-center w-full max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">Add journalist</h1>
        <form
          action={async (formData) => {
            const res = await postJournalist(formData)
            setError(res.error)
            setLoading(false)
          }}
          onSubmit={() => {
            setError('')
            setLoading(true)
          }}
          className="flex flex-col justify-center space-y-4 max-w-sm"
        >
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <InputWithLabel
            required
            name="interviewer"
            label="Which journalist would you like to add? (full name)"
          />
          <InputWithLabel
            required
            name="outlet"
            label="Which website do they write for? (techcrunch.com)"
          />
          <Button disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save journalist
          </Button>
        </form>
      </div>
    </main>
  )
}
