import invariant from 'tiny-invariant';

import { upsertJournalist } from "@/app/api/journalist/model";
import { getAuthorArticles } from "@/lib/newscatcher";
import { JournalistSchema } from "@/schema/journalist";

import { createRouter, protectedProcedure } from "../trpc";

export const journalistRouter = createRouter({
  upsert: protectedProcedure.input(JournalistSchema).mutation(async ({ input }) => {
    const { name, outlet } = input

    const { articles } = await getAuthorArticles(name, outlet)

    invariant(articles && articles.length, 'No articles found. Please update the form and try again.')

    return upsertJournalist(articles)
  }),
});
