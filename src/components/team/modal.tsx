'use client'

import { TeamForm } from '@/components/forms/team'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useQueryParams } from '@/hooks/use-query-params'
import { useRouter } from '@/hooks/use-router'
import { Team } from '@/lib/drizzle'

interface Props {
  teams?: Team[]
}

const CREATE_ID = 'create'

export function TeamModal({ teams }: Props) {
  const router = useRouter()
  const [queryParams, setQueryParams] = useQueryParams()

  const { team: teamId } = queryParams
  const team = teams?.find((team) => team.id === teamId)

  const setShowCreateTeamDialog = (show: boolean) => {
    setQueryParams({ team: show ? CREATE_ID : '' })
  }

  return (
    <Dialog open={!!teamId} onOpenChange={setShowCreateTeamDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{team ? 'Manage' : 'Create'} team</DialogTitle>
          <DialogDescription>
            {team
              ? 'Edit your team details below.'
              : 'Create a new team to manage clients.'}
          </DialogDescription>
        </DialogHeader>
        <TeamForm
          team={team}
          onSuccess={() => {
            setShowCreateTeamDialog(false)
            router.refresh()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
