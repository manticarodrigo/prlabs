import Link from 'next/link'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Author } from '@/lib/drizzle'

export function JournalistSearch({
  team,
  authors,
}: {
  team: string
  authors: Author[]
}) {
  return (
    <Command>
      <CommandInput placeholder="Find a journalist..." />
      <CommandList>
        <CommandEmpty>
          <div>No results found.</div>
        </CommandEmpty>
        <CommandGroup>
          {authors.map((author) => (
            <CommandItem key={author.id} className="relative">
              <Link
                href={`/teams/${team}/journalists/${author.id}`}
                aria-label={`${author.name} - ${author.outlet}`}
                className="absolute w-full h-full"
              />
              <div>
                <div className="text-sm">{author.name}</div>
                <div className="text-xs">{author.outlet}</div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
