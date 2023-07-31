'use client'

import { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Params = { [k: string]: string }
type SetParams = (next: Params) => void

export function useParams(): [Params, SetParams] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params: Params = Object.fromEntries(searchParams)

  const setParams: SetParams = (next) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
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
    const route = `${pathname}${query}` as Route
    router.push(route)
  }

  return [params, setParams]
}
