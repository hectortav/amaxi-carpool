import { z } from "zod";
import axios from "axios";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export type PlaceInfo = {
  html_attributions: string[];
  result: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    adr_address: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      viewport: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
    };
    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    place_id: string;
    plus_code: {
      compound_code: string;
      global_code: string;
    };
    reference: string;
    types: string[];
    url: string;
    utc_offset: number;
    vicinity: string;
  };
  status: string;
};

type Prediction = {
  description: string;
  matched_substrings: {
    length: number;
    offset: number;
  }[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: {
      length: number;
      offset: number;
    }[];
    secondary_text: string;
  };
  terms: {
    offset: number;
    value: string;
  }[];

  types: string[];
};

export const locationRouter = createTRPCRouter({
  getPredictions: publicProcedure
    .input(
      z.object({
        search: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await axios.get<{ predictions: Prediction[] }>(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            input.search,
          )}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
        );

        return response.data.predictions;
      } catch (e) {
        console.error(e);
        return {
          message: "Internal server error",
          errors: {},
        };
      }
    }),
  getPlaceInfo: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const response = await axios.get<PlaceInfo>(
          `https://maps.googleapis.com/maps/api/place/details/json?placeid=${encodeURIComponent(
            input.placeId,
          )}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
        );

        return response.data.result;
      } catch (e) {
        console.error(e);
        return {
          message: "Internal server error",
          errors: {},
        };
      }
    }),
});
