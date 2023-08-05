import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import { journalistRouter } from "./journalist.router";
import { teamRouter } from "./team.router";
import { createRouter } from "./trpc";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = createRouter({
  team: teamRouter,
  journalist: journalistRouter,
});

export type AppRouter = typeof appRouter;
