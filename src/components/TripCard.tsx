import {
  FlagIcon,
  GlobeEuropeAfricaIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import type { Trip, Location, User, Passenger } from "@prisma/client";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

const TripCard = ({
  trip,
  children,
  showDetails,
}: {
  trip: Trip & {
    from: Location | null;
    to: Location | null;
    user?: User;
    passengers: Passenger[];
  };
  showDetails?: boolean;
  children?: React.ReactNode;
}) => {
  const { data: session } = useSession();

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
          {session?.user.id === trip.userId && (
            <div className="rounded-full bg-main/60 px-2 text-background">
              🛞 I am the driver
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <div className="rounded-full bg-main px-2 text-background">
              📅 {trip.date.getDate()}-{trip.date.getMonth() + 1}-
              {trip.date.getFullYear()}
            </div>
            <div className="rounded-full bg-main px-2 text-background">
              ⏰ {trip.date.getHours()}:{trip.date.getMinutes()}
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
      <div className="w-full">{children}</div>
    </div>
  );
};

export default TripCard;
