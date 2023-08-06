
import { createRouter } from "../trpc";
import { journalistRouter } from "./journalist";
import { keywordRouter } from "./keyword";
import { teamRouter } from "./team";

export const appRouter = createRouter({
  team: teamRouter,
  journalist: journalistRouter,
  keyword: keywordRouter
});

export type AppRouter = typeof appRouter;
