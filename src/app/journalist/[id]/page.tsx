'use client'

import { useChat } from 'ai/react'

export default function JournalistDetailPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <main className="mx-auto w-full max-w-xl py-24 flex flex-col stretch">
      {messages.length > 0
        ? messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === 'user' ? 'User: ' : 'AI: '}
              {m.content}
            </div>
          ))
        : null}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed w-full max-w-lg bottom-0 border border-slate-300 rounded mb-8 shadow-xl p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </main>
  )
}