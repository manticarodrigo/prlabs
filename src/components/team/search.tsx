import Link from 'next/link'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Team } from '@/lib/drizzle'

export function TeamSearch({ teams }: { teams: Team[] }) {
  return (
    <Command>
      <CommandInput placeholder="Choose a team..." />
      <CommandList>
        <CommandEmpty>
          <div>No results found.</div>
        </CommandEmpty>
        <CommandGroup>
          {teams.map((team) => (
            <CommandItem key={team.id} className="relative">
              <Link
                href={`/teams/${team.id}`}
                className="absolute w-full h-full"
              />
              <div className="truncate w-full">
                <div className="text-sm">{team.name}</div>
                <div className="text-xs">{team.description}</div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
