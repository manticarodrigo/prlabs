import { auth } from "@clerk/nextjs";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import invariant from 'tiny-invariant';
import { z } from "zod";

import { deleteTeam, upsertTeam } from "@/app/api/team/model";
import { TeamSchema } from "@/schema/team";

const t = initTRPC.create({
  transformer: superjson,
});

export const teamRouter = t.router({
  upsert: t.procedure.input(TeamSchema).mutation(async ({ input }) => {
    const { userId } = auth()

    invariant(userId, 'You must be logged in to create a team.')

    return upsertTeam({ ...input, userId })
  }),
  delete: t.procedure.input(z.string()).mutation(async ({ input }) => {
    const { userId } = auth()

    invariant(userId, 'You must be logged in to delete a team.')

    return deleteTeam(input)
  }),
});
