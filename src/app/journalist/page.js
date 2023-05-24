'use client'

import { useState } from 'react'

const inputClass = 'rounded-md border border-slate-900 p-2'

function TextInput({ type = 'text', name, label, required }) {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className={inputClass}
      />
    </div>
  )
}

export default function Form() {
  const [loading, setLoading] = useState('')
  const [response, setResponse] = useState(null)
  return (
    <div className="flex w-full min-h-screen flex-col items-center justify-center p-6 lg:p-24">
      <div className="w-full max-w-3xl whitespace-break-spaces">
        <h1 className="text-2xl font-bold uppercase">Journalist analyzer</h1>
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
              Utilize the below form to gain an understanding of coverage themes
              of a journalist!
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
                  const res = await fetch('/api/journalist', {
                    method: 'POST',
                    body: new FormData(e.target),
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
              <TextInput
                name="interviewer"
                label="Which journalist would you like to analyze? (full name)"
              />
              <TextInput
                name="outlet"
                label="Which website do they write for? (techcrunch.com)"
              />
              <button
                disabled={Boolean(loading)}
                className={`rounded-md p-4 w-full text-white bg-slate-900 uppercase${
                  loading ? ' animate-pulse' : ''
                }`}
              >
                {loading || 'Create analysis'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
