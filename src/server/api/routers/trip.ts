import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tripRouter = createTRPCRouter({
  mine: protectedProcedure.query(({ ctx }) =>
    ctx.db.trip.findMany({
      where: {
        OR: [
          {
            userId: ctx.session.user.id,
          },
          {
            passengers: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        ],
      },

      orderBy: {
        date: "asc",
      },
      include: {
        from: true,
        to: true,
        passengers: true,
      },
    }),
  ),
  get: protectedProcedure.query(({ ctx }) =>
    ctx.db.trip.findMany({
      where: {
        NOT: {
          userId: ctx.session.user.id,
        },
        date: {
          gte: new Date(),
        },
        passengers: {
          none: {
            userId: ctx.session.user.id,
          },
        },
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
  join: protectedProcedure
    .input(
      z.object({
        tripId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.passenger.create({
        data: { tripId: input.tripId, userId: ctx.session.user.id },
      }),
    ),
  create: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        from: z.union([
          z.object({
            name: z.string().min(3),
            placeId: z.string().min(3),
            latitude: z.string().min(3),
            longitude: z.string().min(3),
          }),
          z.string(),
        ]),
        to: z.union([
          z.object({
            name: z.string().min(3),
            placeId: z.string().min(3),
            latitude: z.string().min(3),
            longitude: z.string().min(3),
          }),
          z.string(),
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let fromId = input.from;
      let toId = input.to;

      if (typeof input.from === "object") {
        const from = await ctx.db.location.create({
          data: { ...input.from },
          select: { id: true },
        });
        fromId = from.id;
      }

      if (typeof input.to === "object") {
        const to = await ctx.db.location.create({
          data: { ...input.to },
          select: { id: true },
        });
        toId = to.id;
      }

      return ctx.db.trip.create({
        data: {
          userId: ctx.session.user.id,
          date: input.date,
          fromId: fromId as string,
          toId: toId as string,
        },
      });
    }),
});
