import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

function generate(len = 5) {
  const charset =
    "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()";
  let result = "";
  for (let i = 0; i < len; i++) {
    const charsetlength = charset.length;
    result += charset.charAt(Math.floor(Math.random() * charsetlength));
  }
  return result;
}

export const companyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        logo: z.string().min(1),
        address: z.object({
          name: z.string().min(3),
          placeId: z.string().min(3),
          latitude: z.string().min(3),
          longitude: z.string().min(3),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const location = await ctx.db.location.create({
        data: { ...input.address },
      });
      return ctx.db.company.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          logo: input.logo,
          code: generate(),
          addressId: location.id,
        },
      });
    }),
  get: protectedProcedure
    .input(
      z
        .object({
          code: z.string(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      if (input?.code) {
        return ctx.db.company.findFirst({
          where: {
            code: input.code,
          },
        });
      }

      return ctx.db.company.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });
    }),
});
