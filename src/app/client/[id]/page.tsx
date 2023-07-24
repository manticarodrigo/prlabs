import ClientCard from '@/components/client/card'
import { db, eq, schema } from '@/lib/drizzle'

export const runtime = 'edge'

export default async function ClientDetailPage({ params }) {
  const { id } = params

  const customer = await db.query.customer.findFirst({
    where: eq(schema.customer.id, id),
  })

  return (
    <main className="flex justify-center items-center p-8 w-full min-h-full">
      <ClientCard customer={customer} />
    </main>
  )
}