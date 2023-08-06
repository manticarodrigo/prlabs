'use client'

import { useParams, usePathname } from 'next/navigation'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switcher } from '@/components/ui/switcher'
import { useQueryParams } from '@/hooks/use-query-params'
import { useRouter } from '@/hooks/use-router'
import { Team } from '@/lib/drizzle'

interface TeamSwitcherProps {
  teams?: Team[]
}

export function TeamSwitcher({ teams = [] }: TeamSwitcherProps) {
  const router = useRouter()
  const params = useParams() ?? {}
  const pathname = usePathname() ?? ''
  const [, setQueryParams] = useQueryParams()

  const handleTeamSelect = (id: string) => {
    const team = (params.team as string) ?? ''
    const hasTeamInPath = team && pathname.includes(team)
    const route = hasTeamInPath ? pathname.replace(team, id) : `/teams/${id}`

    router.push(route)
  }

  return (
    <Switcher
      labels={{
        button: 'Select a team',
        placeholder: 'Search team...',
        empty: 'No team found.',
        heading: 'Teams',
        selected: 'Selected team',
        create: 'Create a team',
      }}
      value={params.team as string}
      options={teams.map((it) => ({ label: it.name ?? '', value: it.id }))}
      renderOption={(option) => {
        if (!option) {
          return (
            <span className="text-muted-foreground truncate">
              No team selected
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
      onSelect={handleTeamSelect}
      onCreate={() => setQueryParams({ team: 'create' })}
    />
  )
}
