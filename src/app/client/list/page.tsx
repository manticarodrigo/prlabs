import { auth } from '@clerk/nextjs'
import Link from 'next/link'

import TeamCard from '@/components/team/card'
import { db, eq, schema } from '@/lib/drizzle'

export default async function ClientListPage() {
  const { userId } = auth()

  const customers = await db.query.customer.findMany({
    where: eq(schema.customer.userId, userId),
  })

  return (
    <main className="flex justify-center items-center p-8 w-full min-h-full">
      <div className="flex flex-col justify-center items-center w-full max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">Your customers</h1>
        <ul className="flex flex-col space-y-4">
          {customers.map((customer) => (
            <li key={customer.id}>
              <Link
                href={`/customer/${customer.id}`}
                className="text-blue-600 hover:underline"
              >
                <TeamCard customer={customer} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
