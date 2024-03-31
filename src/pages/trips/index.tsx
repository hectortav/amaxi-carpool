import React from "react";
import { Layout, Input, Button, LocationInput, TripCard } from "~/components";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import cn from "classnames";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function Trip() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const me = api.user.me.useQuery();
  const disabled =
    !me.data?.licensePlate ||
    !me.data?.driversLicense ||
    !me.data?.numberOfPassengers ||
    !me.data?.carMaker ||
    !me.data?.carModel;
  return (
    <Layout>
      <div className="flex w-full p-2">
        <Button
          className="ml-auto"
          onClick={() => {
            if (disabled) {
              if (
                window.confirm(
                  "Please fill out the Driver's Form under the Profile section.",
                )
              ) {
                void router.push("/profile");
              }
              return;
            }
            setOpen(true);
          }}
        >
          Create trip
        </Button>
      </div>
      {open && <TripForm onClose={() => setOpen(false)} />}
      <TripsList />
    </Layout>
  );
}

interface IFormTrip {
  date: string | null;
  time: string | null;
  from: string | null;
  to: string | null;
}

const TripForm = ({ onClose }: { onClose: () => void }) => {
  const [from, setFrom] = React.useState<
    | {
        name: string;
        placeId: string;
        latitude: string;
        longitude: string;
      }
    | undefined
  >();
  const [to, setTo] = React.useState<
    | {
        name: string;
        placeId: string;
        latitude: string;
        longitude: string;
      }
    | undefined
  >();
  const utils = api.useUtils();
  const create = api.trip.create.useMutation({
    onSuccess() {
      reset();
      onClose();
      void utils.trip.mine.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormTrip>();

  const onSubmit = (data: IFormTrip) => {
    if (!from || !to) return;
    if (!data.time || !data.date) return;
    const [hours, minutes] = data.time.split(":").map(Number);
    if (hours == undefined || minutes === undefined) return;

    const date = new Date(data.date);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    create.mutate({
      date,
      from,
      to,
    });
  };

  return (
    <div className="insets-auto absolute flex h-full w-full items-center justify-center bg-main/40">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "w-5/6 rounded-xl bg-white p-3 sm:w-2/3",
          "ring-white/60 ring-offset-2 ring-offset-main focus:outline-none focus:ring-2",
        )}
      >
        <div className="flex w-full">
          <Button className="ml-auto" icon variant="cancel" onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </div>
        <Input
          {...register("date", {
            required: "Date is required",
            valueAsDate: true,
            validate: {
              minDate: (v) => {
                if (v && new Date(v).getTime() > new Date().getTime()) {
                  return true;
                }
                return "Cannot be in the past.";
              },
            },
          })}
          type="date"
          errors={errors}
          label="Date"
        />

        <Input
          {...register("time", {
            required: "Time is required",
          })}
          type="time"
          errors={errors}
          label="Time"
        />

        <LocationInput
          onSelect={(address) => {
            setFrom(
              address
                ? {
                    name: address.formatted_address,
                    placeId: address.place_id,
                    latitude: `${address.geometry.location.lat}`,
                    longitude: `${address.geometry.location.lng}`,
                  }
                : undefined,
            );
          }}
          placeholder=""
          label="Origin"
          {...register("from", {
            required: "Origin address is required",
          })}
          errors={errors}
        />

        <LocationInput
          onSelect={(address) => {
            setTo(
              address
                ? {
                    name: address.formatted_address,
                    placeId: address.place_id,
                    latitude: `${address.geometry.location.lat}`,
                    longitude: `${address.geometry.location.lng}`,
                  }
                : undefined,
            );
          }}
          placeholder=""
          label="Destination"
          {...register("to", {
            required: "Destination address is required",
          })}
          errors={errors}
        />

        <Button submit>Submit</Button>
      </form>
    </div>
  );
};

const TripsList = () => {
  const { data: myTrips } = api.trip.mine.useQuery();

  return (
    <div className="mx-auto flex w-11/12 flex-col gap-4 sm:w-3/4">
      {myTrips?.map((trip) => <TripCard key={trip.id} {...{ trip }} />)}
    </div>
  );
};

import type { GetServerSideProps } from "next/types";
import { getServerAuthSession } from "~/server/auth";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
