import { auth } from "@clerk/nextjs";
import { createId } from "@paralleldrive/cuid2";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import invariant from 'tiny-invariant';

import { db, schema } from "@/lib/drizzle";
import { CreateClientSchema } from "@/schema/team";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  upsertTeam: t.procedure.input(CreateClientSchema).mutation(async ({ ctx, input }) => {
    const { userId } = auth()

    invariant(userId, 'You must be logged in to create a customer.')

    const { name, description, strategy } = input

    const [customer] = await db
      .insert(schema.customer)
      .values({
        id: createId(),
        userId,
        name,
        description,
        strategy,
        updatedAt: new Date().toISOString(),
      })
      .returning({ id: schema.customer.id })
    return customer;
  }),
});

export type AppRouter = typeof appRouter;
