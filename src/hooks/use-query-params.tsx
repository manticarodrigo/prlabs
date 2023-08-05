'use client'

import { Route } from 'next'
import { usePathname, useSearchParams } from 'next/navigation'

import { useRouter } from '@/hooks/use-router'

type Params = { [k: string]: string }
type SetParams = (next: Params) => void

export function useQueryParams(): [Params, SetParams] {
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const searchParams = useSearchParams() ?? new URLSearchParams()
  const params: Params = Object.fromEntries(searchParams)

  const setParams: SetParams = (next) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    for (const [key, value] of Object.entries(next)) {
      if (value) {
        current.set(key, value.trim())
      } else {
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
