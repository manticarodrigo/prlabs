import { auth } from '@clerk/nextjs'
import { Metadata } from 'next'
import Image from 'next/image'

import { db, eq, schema } from '@/lib/drizzle'

import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { UserNav } from './components/user-nav'
import { taskSchema } from './data/schema'

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.',
}

export const runtime = 'edge'

export default async function TeamListPage() {
  const { userId } = auth()

  const teams = await db.query.customer.findMany({
    where: eq(schema.customer.userId, userId),
  })

  const data = teams.map((team) =>
    taskSchema.parse({
      id: team.name,
      title: team.description,
      label: team.strategy,
      priority: 'high',
      status: 'backlog',
    }),
  )

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden min-h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={data} columns={columns} />
      </div>
    </>
  )
}
