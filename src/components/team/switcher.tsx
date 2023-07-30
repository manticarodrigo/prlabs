'use client'

import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
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
import { useParams } from '@/hooks/use-params'
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
        <AvatarFallback>{team.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      {team.name}
    </>
  )
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {
  teams?: Team[]
}

export default function TeamSwitcher({
  teams = [],
  className,
}: TeamSwitcherProps) {
  const [params, setParams] = useParams()
  const { teamId } = params

  const [open, setOpen] = React.useState(false)
  const selectedTeam = teams.find((team) => team.id === teamId)
  const showNewTeamDialog = !selectedTeam && teamId === 'new'

  const setShowNewTeamDialog = (show: boolean) => {
    if (show) {
      setParams({ teamId: 'new' })
    } else {
      setParams({ teamId: '' })
    }
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
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
              <CommandGroup heading="Teams">
                {teams
                  .filter((team) => team.id !== teamId)
                  .map((team) => (
                    <CommandItem
                      key={team.id}
                      value={team.id}
                      className="text-sm"
                      onSelect={(value) => {
                        setParams({ teamId: value })
                        setOpen(false)
                      }}
                    >
                      <TeamLabel team={team} />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewTeamDialog(true)
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
        <TeamForm
          onSuccess={(id) => {
            setParams({ teamId: id })
            setShowNewTeamDialog(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
