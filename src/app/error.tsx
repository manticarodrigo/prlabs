'use client'

import { Error } from '@/components/error'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html className="w-full h-full">
      <body className="w-full h-full">
        <Error error={error} reset={reset} />
      </body>
    </html>
  )
}
