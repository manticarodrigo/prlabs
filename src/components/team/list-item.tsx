import { MoreVertical } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Team } from '@/lib/drizzle'

interface Props {
  team: Team
  onDelete: (team: Team) => void
  onEdit: (team: Team) => void
}

export function TeamListItem({ team, onDelete, onEdit }: Props) {
  return (
    <div className="relative flex items-center gap-2">
      <Link
        href={`/teams/${team.id}`}
        className="absolute top-0 left-0 w-full h-full hover:bg-background/50 focus:bg-background/50 transition-colors"
      >
        <span className="sr-only">Go to team {team.name}</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative flex h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(
                `
                  Team name: ${team.name}
                  Team description: ${team.description}
                  Team strategy: ${team.strategy}
              `,
              )
            }
          >
            Copy info
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(team)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(team)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="pr-4 min-w-0">
        <div className="text-base font-medium">{team.name}</div>
        <div className="text-sm max-w-md truncate">{team.description}</div>
      </div>
    </div>
  )
}
