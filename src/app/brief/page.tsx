'use client'

import { InputWithLabel } from '@/components/ui/input'
import { TextareaWithLabel } from '@/components/ui/textarea'
import { useState } from 'react'

const inputClass = 'rounded-md border border-slate-900 p-2'

export default function Form() {
  const [loading, setLoading] = useState('')
  const [response, setResponse] = useState(null)
  return (
    <div className="w-full max-w-3xl whitespace-break-spaces">
      <h1 className="text-2xl font-bold uppercase">Briefing book</h1>
      {response ? (
        <>
          <button
            type="button"
            className="block my-2 rounded py-2 px-4 text-slate-50 bg-slate-900 uppercase"
            onClick={() => setResponse(null)}
          >
            Clear result
          </button>
          {response}
        </>
      ) : (
        <>
          <p className="my-4 text-lg">
            Utilize the below form to create a custom briefing book for your
            next media interview!
          </p>
          <form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault()
              setLoading('Loading...')
              const stillLoadingTimeout = setTimeout(() => {
                setLoading('Still loading...')
              }, 5000)
              try {
                const res = await fetch('/api/brief', {
                  method: 'POST',
                  body: new FormData(e.target as HTMLFormElement),
                })
                const data = res.body

                if (!data) {
                  return
                }

                const reader = data.getReader()
                const decoder = new TextDecoder()
                let done = false

                while (!done) {
                  const { value, done: doneReading } = await reader.read()
                  done = doneReading
                  const chunkValue = decoder.decode(value)
                  setResponse((prev) => (prev || '') + chunkValue)
                }
              } finally {
                clearTimeout(stillLoadingTimeout)
                setLoading('')
              }
            }}
            className="space-y-4"
          >
            <InputWithLabel
              name="interviewee"
              label="Who is this brief prepared for? (your client)"
            />
            <InputWithLabel
              name="interviewer"
              label="Who is conducting the interview? (journalist)"
            />
            <InputWithLabel
              name="outlet"
              label="Which website do they write for? (techcrunch.com)"
            />
            <TextareaWithLabel
              name="prompt"
              label="What is the purpose/context of this interview?"
              cols={30}
              rows={10}
            />
            <button
              disabled={Boolean(loading)}
              className={`rounded-md p-4 w-full text-white bg-slate-900 uppercase${
                loading ? ' animate-pulse' : ''
              }`}
            >
              {loading || 'Create brief'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
