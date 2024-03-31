import { postRouter } from "~/server/api/routers/post";
import { locationRouter } from "~/server/api/routers/location";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { carRouter } from "./routers/car";
import { tripRouter } from "./routers/trip";
import { chatRouter } from "./routers/chat";
import { companyRouter } from "./routers/company";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  company: companyRouter,
  trip: tripRouter,
  chat: chatRouter,
  car: carRouter,
  post: postRouter,
  location: locationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
