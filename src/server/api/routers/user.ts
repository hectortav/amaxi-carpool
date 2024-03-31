import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) =>
    ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        address: true,
      },
    }),
  ),
  update: protectedProcedure
    .input(
      z.object({
        firstname: z.string().min(3).optional(),
        lastname: z.string().min(3).optional(),
        dateOfBirth: z.date().optional(),
        phone: z.string().min(3).optional(),
        address: z
          .object({
            name: z.string().min(3),
            placeId: z.string().min(3),
            latitude: z.string().min(3),
            longitude: z.string().min(3),
          })
          .optional(),
        licensePlate: z.string().min(3).optional(),
        driversLicense: z.string().min(3).optional(),
        idNumber: z.string().min(3).optional(),
        carMaker: z.string().min(1).optional(),
        carModel: z.string().min(1).optional(),
        numberOfPassengers: z.number().int().min(1).max(6).optional(),
      }),
    )
    .mutation(async ({ ctx, input: { address, ...input } }) => {
      let location = undefined;
      if (address) {
        const userAddress = await ctx.db.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
          select: {
            addressId: true,
          },
        });
        if (userAddress?.addressId) {
          await ctx.db.location.delete({
            where: {
              id: userAddress.addressId,
            },
          });
        }
        location = await ctx.db.location.create({
          data: { ...address },
        });
      }

      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
          ...(address && location ? { addressId: location.id } : {}),
        },
      });
    }),
});
