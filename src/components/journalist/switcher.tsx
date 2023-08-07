'use client'

import { useParams, usePathname } from 'next/navigation'

import { JournalistForm } from '@/components/forms/journalist'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useQueryParams } from '@/hooks/use-query-params'
import { useRouter } from '@/hooks/use-router'
import { Author } from '@/lib/drizzle'

import { Switcher } from '../ui/switcher'

interface JournalistSwitcherProps {
  journalists?: Author[]
}

const CREATE_ID = 'create'

export function JournalistSwitcher({
  journalists = [],
}: JournalistSwitcherProps) {
  const router = useRouter()
  const params = useParams() ?? {}
  const pathname = usePathname() ?? ''
  const [queryParams, setQueryParams] = useQueryParams()

  const setShowCreateJournalistDialog = (show: boolean) => {
    setQueryParams({ journalist: show ? CREATE_ID : '' })
  }

  const handleJournalistSelect = (id: string) => {
    const journalist = (params.journalist as string) ?? ''
    const hasJournalistInPath = journalist && pathname.includes(journalist)
    const route = hasJournalistInPath
      ? pathname.replace(journalist, id)
      : `journalists/${id}`

    router.push(route)
  }

  if (!params.team) {
    return null
  }

  return (
    <>
      <Switcher
        labels={{
          button: 'Select a journalist',
          placeholder: 'Search journalist...',
          empty: 'No journalist found.',
          heading: 'Journalists',
          selected: 'Selected journalist',
          create: 'Create a journalist',
        }}
        value={params.journalist as string}
        options={journalists.map((it) => ({
          label: it.name ?? '',
          value: it.id,
        }))}
        renderOption={(option) => {
          if (!option) {
            return (
              <span className="text-muted-foreground truncate">
                No journalist selected
              </span>
            )
          }
          return (
            <div className="flex items-center truncate">
              <Avatar className="hidden sm:block mr-2 h-6 w-6">
                <AvatarFallback className="uppercase text-xs">
                  {option.label.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{option.label}</span>
            </div>
          )
        }}
        onSelect={handleJournalistSelect}
        onCreate={() => setQueryParams({ journalist: CREATE_ID })}
      />
      <Dialog
        open={queryParams.journalist === CREATE_ID}
        onOpenChange={setShowCreateJournalistDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create journalist</DialogTitle>
            <DialogDescription>
              Add a new journalist to manage products and customers.
            </DialogDescription>
          </DialogHeader>
          <JournalistForm onSuccess={handleJournalistSelect} />
        </DialogContent>
      </Dialog>
    </>
  )
}
