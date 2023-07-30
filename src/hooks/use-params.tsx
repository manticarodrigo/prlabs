'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Params = { [k: string]: string }
type SetParams = (next: Params) => void

export function useParams(): [Params, SetParams] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = new URLSearchParams(Array.from(searchParams.entries()))
  const params: Params = Object.fromEntries(current)

  const setParams: SetParams = (next) => {
    for (const [key, value] of Object.entries(next)) {
      if (value) {
        current.set(key, value.trim())
      } else {
        console.log('setParams', key, value)
        current.delete('team')
      }
    }
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`${pathname}${query}`)
  }

  return [params, setParams]
}
