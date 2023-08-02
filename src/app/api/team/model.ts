
import { createId } from "@paralleldrive/cuid2"

import { db, eq, schema } from "@/lib/drizzle"

export function getTeams(userId: string) {
  return db.query.team.findMany({
    where: eq(schema.team.userId, userId),
  })
}

export function getTeam(slug: string) {
  return db.query.team.findFirst({
    where: eq(schema.team.slug, slug),
  })
}

export async function upsertTeam({ userId, name = undefined, slug = undefined, description = undefined, strategy = undefined }) {
  const [team] = await db
    .insert(schema.team)
    .values({
      id: createId(),
      userId,
      name,
      slug,
      description,
      strategy,
      updatedAt: new Date().toISOString(),
    })
    .returning({ slug: schema.team.slug })
  return team
}