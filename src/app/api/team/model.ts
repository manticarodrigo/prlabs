
import { createId } from "@paralleldrive/cuid2"

import { db, eq, schema } from "@/lib/drizzle"

export function getTeams(userId: string) {
  return db.query.team.findMany({
    where: eq(schema.team.userId, userId),
  })
}

export function getTeam(id: string) {
  return db.query.team.findFirst({
    where: eq(schema.team.id, id),
  })
}

export async function upsertTeam({ userId, name = undefined, description = undefined, strategy = undefined }) {
  const [team] = await db
    .insert(schema.team)
    .values({
      id: createId(),
      userId,
      name,
      description,
      strategy,
      updatedAt: new Date().toISOString(),
    })
    .returning({ id: schema.team.id })
  return team
}