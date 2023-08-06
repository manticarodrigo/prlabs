import { redirect } from 'next/navigation'

interface Props {
  params: {
    team: string
  }
}

export default function TeamPage({ params }: Props) {
  redirect(`/teams/${params.team}/journalists`)
}
