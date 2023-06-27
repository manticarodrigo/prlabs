import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Author } from '@/lib/prisma'
import Link from 'next/link'

export default function JournalistSearch({ authors }: { authors: Author[] }) {
  return (
    <Command>
      <CommandInput placeholder="Find a journalist..." />
      <CommandList>
        <CommandEmpty>
          <div>No results found.</div>
          <Link href="/journalist" className="text-blue-600 underline">
            Click to add a journalist
          </Link>
        </CommandEmpty>
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
      </CommandList>
    </Command>
  )
}
