import { auth } from "@clerk/nextjs";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import invariant from "tiny-invariant";


const t = initTRPC.create({
  transformer: superjson,
});

const enforceUserIsAuthed = t.middleware(({ next }) => {
  const session = auth()

  invariant(session.userId, 'You must be logged in to perform this action.')

  return next({ ctx: { session } });
});

export const createRouter = t.router
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
