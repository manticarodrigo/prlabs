'use client'

import Link from 'next/link'

import { TeamListItem } from '@/components/team/list-item'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useRouter } from '@/hooks/use-router'
import { Team } from '@/lib/drizzle'
import { trpc } from '@/lib/trpc'
import { onErrorToast } from '@/util/toast'

interface Props {
  teams: Team[]
}

export function TeamList({ teams }: Props) {
  const router = useRouter()
  const mutation = trpc.team.delete.useMutation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your teams</CardTitle>
        <CardDescription>
          You can choose, manage, and create teams below.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {teams.map((team) => (
            <li key={team.id} className="p-2">
              <TeamListItem
                team={team}
                onEdit={() => null}
                onDelete={() =>
                  mutation.mutate(team.id, {
                    onSuccess: router.refresh,
                    onError: onErrorToast,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-6">
        <Button asChild>
          <Link href="/teams?team=create">Create a new team</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
