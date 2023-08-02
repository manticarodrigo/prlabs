import { redirect } from 'next/navigation'

export default function TeamPage({ params }) {
  redirect(`/teams/${params.team}/journalists`)
}
