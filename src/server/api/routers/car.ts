import { z } from "zod";
import cars from "../../../../data/cars.json";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type Cars = Record<
  string,
  Record<
    string,
    Array<{
      "Vehicle Class": string;
      "Engine Size(L)": number;
      Cylinders: number;
      Transmission: string;
      "Fuel Type": string;
      "Fuel Consumption City (L/100 km)": number;
      "Fuel Consumption Hwy (L/100 km)": number;
      "Fuel Consumption Comb (L/100 km)": number;
      "Fuel Consumption Comb (mpg)": number;
      "CO2 Emissions(g/km)": number;
    }>
  >
>;

export const carRouter = createTRPCRouter({
  makers: publicProcedure
    .input(z.object({ search: z.string() }))
    .query(({ input }) => {
      const makers = Object.keys(cars as Cars);
      return makers.filter((m) =>
        m.toLowerCase().includes(input.search.toLowerCase()),
      );
    }),
  models: publicProcedure
    .input(z.object({ maker: z.string(), search: z.string() }))
    .query(({ input }) => {
      const models = Object.keys((cars as Cars)[input.maker] ?? {});
      return models.filter((m) =>
        m.toLowerCase().includes(input.search.toLowerCase()),
      );
    }),
  details: publicProcedure
    .input(z.object({ maker: z.string(), model: z.string() }))
    .query(({ input }) => {
      return (cars as Cars)[input.maker]?.[input.model]?.[0];
    }),
});
