import React from "react";
import { Layout, Input, Button, LocationInput } from "~/components";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

interface IFormCompany {
  name: string | null;
  logo: string | null;
  address: string | null;
}

export default function AdminCreate() {
  const utils = api.useUtils();
  const [address, setAddress] = React.useState<
    | {
        name: string;
        placeId: string;
        latitude: string;
        longitude: string;
      }
    | undefined
  >();
  const create = api.company.create.useMutation({
    onSuccess() {
      toast("Company created!");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormCompany>();

  const onSubmit = (data: IFormCompany) => {
    if (!address) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    // @ts-expect-error null undefined
    create.mutate({
      ...data,
      address,
    });
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          errors={errors}
          label="Name"
        />
        <Input
          {...register("logo", {
            required: "Logo is required",
            minLength: {
              value: 2,
              message: "Logo must be at least 2 characters",
            },
          })}
          errors={errors}
          label="Logo"
        />

        <LocationInput
          onSelect={(address) => {
            setAddress(
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
          label="Address"
          {...register("address", {
            required: "Address is required",
          })}
          errors={errors}
        />

        <Button submit>Submit</Button>
      </form>
    </Layout>
  );
}

import type { GetServerSideProps } from "next/types";
import { getServerAuthSession } from "~/server/auth";

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
