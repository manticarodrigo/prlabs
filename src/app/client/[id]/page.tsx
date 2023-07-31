import TeamCard from '@/components/team/card'
import { db, eq, schema } from '@/lib/drizzle'

export default async function ClientDetailPage({ params }) {
  const { id } = params

  const customer = await db.query.team.findFirst({
    where: eq(schema.team.id, id),
  })

  return (
    <main className="flex justify-center items-center p-8 w-full min-h-full">
      <TeamCard customer={customer} />
    </main>
  )
}
