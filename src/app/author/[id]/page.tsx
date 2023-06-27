import { redirect } from 'next/navigation'

export default function AuthorPage({ params }) {
  const { id } = params
  redirect(`/author/${id}/articles`)
}
