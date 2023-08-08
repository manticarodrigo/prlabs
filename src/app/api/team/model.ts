import { createId } from '@paralleldrive/cuid2'

import { db, desc, eq, schema, Team } from '@/lib/drizzle'
import { KeywordSchemaInput } from '@/schema/keyword'
import { TeamSchemaInput } from '@/schema/team'

export function getTeamMetadata({
  name,
  description,
  strategy,
  keywords,
}: Team) {
  return `
        name: ${name}
        description: ${description}
        strategy: ${strategy}
        keywords: ${keywords}
  `
}

export async function getTeams(userId: string) {
  const teams = await db.query.team.findMany({
    where: eq(schema.team.userId, userId),
    orderBy: desc(schema.team.updatedAt),
    with: {
      keywords: {
        with: {
          keyword: true,
        }
      },
    }
  })

  return teams.map((team) => ({
    ...team,
    keywords: team.keywords?.map(({ keyword }) => keyword),
  }))
}

export async function getTeam(id: string) {
  const team = await db.query.team.findFirst({
    where: eq(schema.team.id, id),
    with: {
      keywords: {
        with: {
          keyword: true,
        }
      },
    }
  })

  return team && {
    ...team,
    keywords: team.keywords?.map(({ keyword }) => keyword),
  }
}

export async function upsertTeam(userId: string, {
  id,
  name,
  description,
  strategy,
  keywords,
}: TeamSchemaInput & { keywords?: KeywordSchemaInput[] }) {
  const baseFields = {
    name,
    description,
    strategy,
    updatedAt: new Date().toISOString(),
  }

  return db.transaction(async (tx) => {
    const [team] = id
      ? await tx
        .update(schema.team)
        .set(baseFields)
        .where(eq(schema.team.id, id))
        .returning({ id: schema.team.id })
      : await tx
        .insert(schema.team)
        .values({
          ...baseFields,
          id: createId(),
          userId,
        })
        .returning({ id: schema.team.id })

    if (team && keywords) {
      await tx.delete(schema.teamKeywords).where(eq(schema.teamKeywords.teamId, team.id))

      for (const keyword of keywords) {
        if (keyword.id?.startsWith('temp')) {
          keyword.id = undefined
        }

        const found = keyword.id && await tx.query.keyword.findFirst({
          where: eq(schema.keyword.id, keyword.id),
        })

        const [created] = found
          ? [found]
          : await tx
            .insert(schema.keyword)
            .values({
              id: keyword.id ?? createId(),
              name: keyword.name,
            })
            .onConflictDoNothing()
            .returning({ id: schema.keyword.id })

        await tx.insert(schema.teamKeywords).values({
          keywordId: created.id,
          teamId: team.id ?? '',
        }).onConflictDoNothing()
      }
    }

    return team
  })
}

export async function deleteTeam(id: string) {
  return db.delete(schema.team).where(eq(schema.team.id, id))
}
