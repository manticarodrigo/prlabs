import { redirect } from 'next/navigation'

export default function JournalistPage({ params }) {
  const { id } = params
  redirect(`/journalist/${id}/articles`)
}
