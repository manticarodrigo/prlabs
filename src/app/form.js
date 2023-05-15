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
    <div className="max-w-3xl whitespace-break-spaces">
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
                  body: new FormData(e.target),
                })
                const data = await res.json()
                setResponse(data)
              } finally {
                clearTimeout(stillLoadingTimeout)
                setLoading('')
              }
            }}
            className="space-y-4"
          >
            <TextInput
              name="preparer"
              label="Who was this brief prepared by? (your name)"
            />
            <TextInput
              name="interviewee"
              label="Who is this brief prepared for? (your client)"
            />
            <TextInput
              name="interviewer"
              label="Who is conducting the interview? (journalist)"
            />
            <TextInput
              name="outlet"
              label="Which website do they write for? (techcrunch.com)"
            />
            <div className="flex flex-col space-y-1">
              <label htmlFor="prompt">
                What is the purpose/context of this interview?
              </label>
              <textarea
                name="prompt"
                cols="30"
                rows="10"
                className={inputClass}
              />
            </div>
            <button
              disabled={Boolean(loading)}
              className={`rounded-md p-4 w-full text-white bg-slate-900 uppercase${
                loading ? ' animate-pulse' : ''
              }`}
            >
              {loading || 'Create Brief'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
