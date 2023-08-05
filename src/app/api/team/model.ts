import { createId } from '@paralleldrive/cuid2'

import { db, desc, eq, schema } from '@/lib/drizzle'

export function getTeams(userId: string) {
  return db.query.team.findMany({
    where: eq(schema.team.userId, userId),
    orderBy: desc(schema.team.updatedAt),
  })
}

export function getTeam(id: string) {
  return db.query.team.findFirst({
    where: eq(schema.team.id, id),
  })
}

export async function upsertTeam({
  userId,
  id = undefined,
  name = undefined,
  description = undefined,
  strategy = undefined,
}) {
  const baseFields = {
    name,
    description,
    strategy,
    updatedAt: new Date().toISOString(),
  }

  if (id) {
    const [team] = await db
      .update(schema.team)
      .set(baseFields)
      .where(eq(schema.team.id, id))
      .returning({ id: schema.team.id })
    return team
  }
  const [team] = await db
    .insert(schema.team)
    .values({
      ...baseFields,
      id: createId(),
      userId,
    })
    .returning({ id: schema.team.id })
  return team
}

export async function deleteTeam(id: string) {
  return db.delete(schema.team).where(eq(schema.team.id, id))
}
