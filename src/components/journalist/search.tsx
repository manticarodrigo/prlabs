import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Author } from '@/lib/prisma'

export function JournalistSearch({ authors }: { authors: Author[] }) {
  return (
    <Command>
      <CommandInput placeholder="Find a journalist..." />
      <CommandList>
        <CommandEmpty>
          <div>No results found.</div>
          <Button asChild className="mt-4">
            <Link href="/journalist">Click to add a journalist</Link>
          </Button>
        </CommandEmpty>
        <CommandGroup>
          {authors.map((author) => (
            <CommandItem key={author.id} className="relative">
              <Link
                href={`/journalist/${author.id}`}
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
