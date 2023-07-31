import { auth } from "@clerk/nextjs";
import { createId } from "@paralleldrive/cuid2";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import invariant from 'tiny-invariant';

import { db, schema } from "@/lib/drizzle";
import { TeamSchema } from "@/schema/team";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  upsertTeam: t.procedure.input(TeamSchema).mutation(async ({ ctx, input }) => {
    const { userId } = auth()

    invariant(userId, 'You must be logged in to create a team.')

    const { name, slug, description, strategy } = input

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
    return team;
  }),
});

export type AppRouter = typeof appRouter;
