import { z } from "zod";

import { db, ilike, schema } from '@/lib/drizzle';

import { createRouter, protectedProcedure } from "../trpc";


export const keywordRouter = createRouter({
  search: protectedProcedure.input(z.string().optional()).query(({ input }) => {
    return db.query.keyword.findMany({
      where: input ? ilike(schema.keyword.name, `%${input}%`) : undefined,
    })
  }),
});
