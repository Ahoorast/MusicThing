import { db } from '$lib/server/db';
import { genres } from '$lib/server/db/schema';
import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';

export const t = initTRPC.context<Context>().create();

const genreRouter = t.router({
  all: t.procedure.query(async () => {
    return await db.select().from(genres);
  })
});

export const router = t.router({
  greeting: t.procedure.query(async () => {
    return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
  }),
  genres: genreRouter
});


export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;

