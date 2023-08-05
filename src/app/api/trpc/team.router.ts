import { z } from "zod";

import { deleteTeam, upsertTeam } from "@/app/api/team/model";
import { TeamSchema } from "@/schema/team";

import { createRouter, protectedProcedure } from "./trpc";


export const teamRouter = createRouter({
  upsert: protectedProcedure.input(TeamSchema).mutation(async ({ ctx, input }) => {
    const { userId } = ctx.session
    return upsertTeam({ ...input, userId })
  }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return deleteTeam(input)
  }),
});
