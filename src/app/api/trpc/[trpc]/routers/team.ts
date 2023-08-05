import { z } from "zod";

import { deleteTeam, upsertTeam } from "@/app/api/team/model";
import { TeamSchema } from "@/schema/team";

import { createRouter, protectedProcedure } from "../trpc";


export const teamRouter = createRouter({
  upsert: protectedProcedure.input(TeamSchema).mutation(async ({ ctx, input }) => {
    return upsertTeam(ctx.session.userId, input)
  }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return deleteTeam(input)
  }),
});
