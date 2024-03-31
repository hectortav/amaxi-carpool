import React from "react";
import { Layout, TripCard } from "~/components";
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

  return (
    <div className="mx-auto mt-4 flex w-11/12 flex-col gap-4 sm:w-3/4">
      {myTrips?.map((trip) => (
        <TripCard
          key={trip.id}
          {...{ trip }}
          showDetails
          showActions
        ></TripCard>
      ))}
    </div>
  );
};
