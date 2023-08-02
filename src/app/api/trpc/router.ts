import { auth } from "@clerk/nextjs";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import invariant from 'tiny-invariant';

import { upsertJournalist } from "@/app/api/journalist/model";
import { upsertTeam } from "@/app/api/team/model";
import { getNewsArticles } from "@/lib/newscatcher";
import { JournalistSchema } from "@/schema/journalist";
import { TeamSchema } from "@/schema/team";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  upsertTeam: t.procedure.input(TeamSchema).mutation(async ({ ctx, input }) => {
    const { userId } = auth()

    invariant(userId, 'You must be logged in to create a team.')

    return upsertTeam({ ...input, userId })
  }),
  upsertJournalist: t.procedure.input(JournalistSchema).mutation(async ({ ctx, input }) => {
    const { userId } = auth()

    invariant(userId, 'You must be logged in to create a journalist.')

    const { name, outlet } = input

    invariant(name, 'You must provide a name to create a journalist.')
    invariant(outlet, 'You must provide an outlet to create a journalist.')

    const articles = await getNewsArticles(name, outlet)

    invariant(articles && articles.length, 'No articles found. Please update the form and try again.')

    return upsertJournalist(articles)
  }),
});

export type AppRouter = typeof appRouter;
