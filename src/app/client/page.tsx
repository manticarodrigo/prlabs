import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function ClientPage() {
  redirect('/client/list')
}
