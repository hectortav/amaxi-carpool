import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ tripId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.message.findMany({
        where: {
          tripId: input.tripId,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: true,
        },
      }),
    ),
  send: protectedProcedure
    .input(z.object({ tripId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.message.create({
        data: {
          tripId: input.tripId,
          userId: ctx.session.user.id,
        },
      }),
    ),
  rooms: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ ctx }) =>
      ctx.db.trip.findMany({
        where: {
          OR: [
            {
              passengers: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
            {
              AND: [
                {
                  userId: ctx.session.user.id,
                },
                {
                  NOT: {
                    passengers: {
                      every: {
                        userId: ctx.session.user.id,
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
        orderBy: {
          date: "asc",
        },
        include: {
          from: true,
          to: true,
          user: true,
          passengers: true,
        },
      }),
    ),
});
