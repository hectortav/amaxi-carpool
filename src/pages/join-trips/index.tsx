import React from "react";
import { toast } from "react-toastify";
import { Button, Layout, TripCard } from "~/components";
import { api } from "~/utils/api";

export default function JoinTrip() {
  return (
    <Layout>
      <TripsList />
    </Layout>
  );
}

const TripsList = () => {
  const { data: myTrips } = api.trip.get.useQuery();
  const utils = api.useUtils();
  const join = api.trip.join.useMutation({
    onSuccess() {
      toast("Welcome onboard!");
      void utils.trip.get.invalidate();
    },
  });

  return (
    <div className="mx-auto mt-4 flex w-11/12 flex-col gap-4 sm:w-3/4">
      {myTrips?.map((trip) => (
        <TripCard key={trip.id} {...{ trip }} showDetails>
          <div className="mt-2 flex w-full items-center ">
            <Button
              className="mr-auto"
              onClick={() =>
                join.mutate({
                  tripId: trip.id,
                })
              }
            >
              Join trip
            </Button>
          </div>
        </TripCard>
      ))}
    </div>
  );
};
