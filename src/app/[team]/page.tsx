import { Metadata } from 'next'

import { getJournalists } from '../api/journalist/model'
import { columns } from '../teams/components/columns'
import { DataTable } from '../teams/components/data-table'
import { taskSchema } from '../teams/data/schema'

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.',
}

export default async function TeamListPage() {
  const journalists = await getJournalists()

  const data = journalists.map((it) =>
    taskSchema.parse({
      id: it.name,
      title: it.outlet,
      label: it.id,
      priority: 'high',
      status: 'backlog',
    }),
  )

  return (
    <div className="flex flex-1 flex-col space-y-8 p-8 min-h-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of active journalists. Make sure to add a new
          journalist if you don&apos;t see them here. Click on a journalist to
          begin your workflow.
        </p>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  )
}
