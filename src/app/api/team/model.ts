
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
