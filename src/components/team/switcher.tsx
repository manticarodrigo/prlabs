'use client'

import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

import { TeamForm } from '@/components/forms/team'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useQueryParams } from '@/hooks/use-query-params'
import { useRouter } from '@/hooks/use-router'
import { Team } from '@/lib/drizzle'
import { cn } from '@/lib/utils'

interface TeamLabelProps {
  team?: Team
}

function TeamLabel({ team }: TeamLabelProps) {
  if (!team) {
    return <span className="text-muted-foreground">No team selected</span>
  }
  return (
    <>
      <Avatar className="mr-2 h-5 w-5">
        <AvatarFallback className="uppercase">
          {team.name.slice(0, 2)}
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

const CREATE_ID = 'create'

export function TeamSwitcher({ teams = [], className }: TeamSwitcherProps) {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const [queryParams, setQueryParams] = useQueryParams()

  const [open, setOpen] = React.useState(false)
  const selectedTeam = teams.find((it) => it.slug === params.team)
  const unselectedTeams = teams.filter((it) => it.slug !== params.team)

  const setShowCreateTeamDialog = (show: boolean) => {
    if (show) {
      setQueryParams({ team: CREATE_ID })
    } else {
      setQueryParams({ team: '' })
    }
  }

  const handleTeamSelect = (slug: string) => {
    const team = (params.team as string) ?? ''
    const hasTeamInPath = team && pathname.includes(team)
    const route = hasTeamInPath
      ? pathname.replace(team, slug)
      : `/teams/${slug}`

    router.push(route)
    setOpen(false)
  }

  return (
    <Dialog
      open={queryParams.team === CREATE_ID}
      onOpenChange={setShowCreateTeamDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn('w-[200px] justify-between', className)}
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
                      value={team.slug}
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
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowCreateTeamDialog(true)
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <TeamForm onSuccess={handleTeamSelect} />
      </DialogContent>
    </Dialog>
  )
}
