
import { createRouter } from "../trpc";
import { journalistRouter } from "./journalist";
import { teamRouter } from "./team";

export const appRouter = createRouter({
  team: teamRouter,
  journalist: journalistRouter,
});

export type AppRouter = typeof appRouter;
