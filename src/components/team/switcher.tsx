'use client'

import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useQueryParams } from '@/hooks/use-query-params'
import { useRouter } from '@/hooks/use-router'
import { Team } from '@/lib/drizzle'

interface TeamLabelProps {
  team?: Team
}

function TeamLabel({ team }: TeamLabelProps) {
  if (!team) {
    return <span className="text-muted-foreground">No team selected</span>
  }
  return (
    <>
      <Avatar className="mr-2 h-6 w-6">
        <AvatarFallback className="uppercase text-xs">
          {team.name?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      {team.name}
    </>
  )
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {
  teams?: Team[]
}

export function TeamSwitcher({ teams = [] }: TeamSwitcherProps) {
  const router = useRouter()
  const params = useParams() ?? {}
  const pathname = usePathname() ?? ''
  const [, setQueryParams] = useQueryParams()

  const [open, setOpen] = React.useState(false)
  const selectedTeam = teams.find((it) => it.id === params.team)
  const unselectedTeams = teams.filter((it) => it.id !== params.team)

  const setShowCreateTeamDialog = (show: boolean) => {
    setQueryParams({ team: show ? 'create' : '' })
  }

  const handleTeamSelect = (id: string) => {
    const team = (params.team as string) ?? ''
    const hasTeamInPath = team && pathname.includes(team)
    const route = hasTeamInPath ? pathname.replace(team, id) : `/teams/${id}`

    router.push(route)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className="w-[200px] justify-between"
        >
          <TeamLabel team={selectedTeam} />
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No team found.</CommandEmpty>
            {selectedTeam && (
              <CommandGroup heading="Selected team">
                <CommandItem value={selectedTeam.id} className="text-sm">
                  <TeamLabel team={selectedTeam} />
                  <Check className="ml-auto h-4 w-4" />
                </CommandItem>
              </CommandGroup>
            )}
            {unselectedTeams.length > 0 && (
              <CommandGroup heading="Teams">
                {unselectedTeams.map((team) => (
                  <CommandItem
                    key={team.id}
                    value={team.id}
                    className="text-sm"
                    onSelect={handleTeamSelect}
                  >
                    <TeamLabel team={team} />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  setShowCreateTeamDialog(true)
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create team
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
