import {
  FlagIcon,
  GlobeEuropeAfricaIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { FaCar } from "react-icons/fa";
import { BiTrip } from "react-icons/bi";
import { CiCalendarDate } from "react-icons/ci";
import type { Trip, Location, User, Passenger } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import {
  calculateDistance,
  calculateFuelConsumption,
  extraCosts,
  getFuelPrice,
} from "~/utils/distance";
import Button from "./Button";

const TripCard = ({
  trip,
  showDetails,
  showActions,
}: {
  trip: Trip & {
    from: Location | null;
    to: Location | null;
    user?: User;
    passengers: Passenger[];
  };
  showDetails?: boolean;
  showActions?: boolean;
}) => {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const join = api.trip.join.useMutation({
    onSuccess() {
      toast("Welcome onboard!");
      void utils.trip.get.invalidate();
    },
  });

  const carDetails = api.car.details.useQuery(
    {
      maker: trip.user?.carMaker ?? "",
      model: trip.user?.carModel ?? "",
    },
    {
      enabled: !!(trip.user?.carMaker && trip.user?.carModel),
    },
  );
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-4">
      <div className="flex w-full">
        <div className="ml-auto flex flex-col gap-2 sm:flex-row">
          {trip.from && trip.to && (
            <div className="flex items-center gap-2 rounded-full bg-main/60 px-2 text-background">
              <BiTrip className="h-4 w-4" />{" "}
              {calculateDistance(
                trip.from?.latitude,
                trip.from?.longitude,
                trip.to?.latitude,
                trip.to?.longitude,
              ).toFixed(2)}{" "}
              km
            </div>
          )}
          {session?.user.id === trip.userId && (
            <div className="flex items-center gap-2 rounded-full bg-main/60 px-2 text-background">
              <FaCar className="h-4 w-4" /> I am the driver
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <div className="flex items-center gap-2 rounded-full bg-main px-2 text-background">
              <CiCalendarDate className="h-4 w-4" /> {trip.date.getDate()}-
              {trip.date.getMonth() + 1}-{trip.date.getFullYear()}
            </div>
            <div className="rounded-full bg-main px-2 text-background">
              {trip.date.getHours()}:{trip.date.getMinutes()}
            </div>
          </div>
        </div>
      </div>
      <ul className="flex flex-col gap-4">
        <li className="flex flex-row items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/50 p-2 shadow-md sm:min-w-[6rem]">
            <MapPinIcon className="h-6 w-6 sm:ml-1" />
            <span className="mx-auto hidden text-sm font-semibold sm:block">
              From:
            </span>
          </div>
          {trip.from?.name}
        </li>
        <li className="flex flex-row items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/50 p-2 shadow-md sm:min-w-[6rem]">
            <FlagIcon className="h-6 w-6 sm:ml-1" />
            <span className="mx-auto hidden text-sm font-semibold sm:block">
              To:
            </span>{" "}
          </div>
          {trip.to?.name}
        </li>
      </ul>
      {showDetails && (
        <div className="my-4 flex w-full flex-col gap-4">
          <div className="flex gap-1">
            {trip.user?.numberOfPassengers &&
              new Array(trip.user.numberOfPassengers + 1)
                .fill(0)
                .map((_, index) => {
                  return (
                    <UserIcon
                      key={index}
                      className={`h-6 w-6 ${index <= trip.passengers?.length ? "text-main" : "text-secondary"}`}
                    />
                  );
                })}
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-main/30 bg-background p-2">
            <div>
              <GlobeEuropeAfricaIcon
                className="h-8 w-8"
                style={
                  carDetails?.data?.["CO2 Emissions(g/km)"]
                    ? {
                        color:
                          carDetails?.data?.["CO2 Emissions(g/km)"] <= 100
                            ? "green"
                            : carDetails?.data?.["CO2 Emissions(g/km)"] <= 150
                              ? "yellow"
                              : "red",
                      }
                    : {}
                }
              />
            </div>
            <div>
              <div>
                CO2 Emissions(g/km): {carDetails?.data?.["CO2 Emissions(g/km)"]}
              </div>
              <div>
                Fuel Consumption City (L/100 km):{" "}
                {carDetails?.data?.["Fuel Consumption City (L/100 km)"]}
              </div>
            </div>
          </div>
        </div>
      )}
      {showActions && (
        <div className="w-full">
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
            {trip.from &&
              trip.to &&
              carDetails?.data?.["Fuel Consumption City (L/100 km)"] && (
                <div className="rounded-full border border-main/30 bg-yellow-400/30 px-2">
                  {(
                    (calculateFuelConsumption(
                      carDetails.data["Fuel Consumption City (L/100 km)"],
                      calculateDistance(
                        trip.from?.latitude,
                        trip.from?.longitude,
                        trip.to?.latitude,
                        trip.to?.longitude,
                      ),
                    ) *
                      getFuelPrice() +
                      extraCosts()) /
                    // + the driver + me if I join
                    (trip.passengers.length + 1 + 1) /
                    2
                  ).toFixed(2)}{" "}
                  € / per passenger
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;
