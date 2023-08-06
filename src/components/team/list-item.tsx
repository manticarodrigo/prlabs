import { MoreVertical } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
    <div className="relative flex items-center gap-4">
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
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit(team)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(team)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="min-w-0">
        <div className="text-base font-medium">{team.name}</div>
        <div className="text-sm max-w-md truncate">{team.description}</div>
      </div>
      <ul className="flex items-start flex-wrap gap-2 min-w-0">
        {team.keywords?.map((keyword) => (
          <Badge key={keyword.id} variant="secondary">
            {keyword.name}
          </Badge>
        ))}
      </ul>
    </div>
  )
}
