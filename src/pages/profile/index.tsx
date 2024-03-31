import React from "react";
import {
  Layout,
  Input,
  Button,
  LocationInput,
  Autocomplete,
} from "~/components";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { Tab } from "@headlessui/react";
import cn from "classnames";
import { formatDate } from "~/utils/date";
import { toast } from "react-toastify";

export default function Driver() {
  const categories = [
    { name: "Common", form: CommonForm },
    { name: "Driver", form: DriverForm },
    { name: "Passenger", form: PassengerForm },
  ];

  return (
    <Layout>
      <div className="mx-auto w-full max-w-md px-2 py-16 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-secondary p-1">
            {categories.map(({ name }) => (
              <Tab
                key={name}
                className={({ selected }) =>
                  cn(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                    "ring-white/60 ring-offset-2 ring-offset-main focus:outline-none focus:ring-2",
                    selected
                      ? "bg-white text-main shadow"
                      : "text-text hover:bg-white/[0.12] hover:text-white",
                  )
                }
              >
                {name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {categories.map(({ form: Form }, idx) => (
              <Tab.Panel
                key={idx}
                className={cn(
                  "rounded-xl bg-white p-3",
                  "ring-white/60 ring-offset-2 ring-offset-main focus:outline-none focus:ring-2",
                )}
              >
                <Form />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Layout>
  );
}

interface IFormCommon {
  firstname: string | null;
  lastname: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
}

const CommonForm = () => {
  const [address, setAddress] = React.useState<
    | {
        name: string;
        placeId: string;
        latitude: string;
        longitude: string;
      }
    | undefined
  >();
  const utils = api.useUtils();
  const { data: me } = api.user.me.useQuery();
  const update = api.user.update.useMutation({
    onSuccess() {
      toast("Common details saved!");
      void utils.user.me.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormCommon>();

  const onSubmit = (data: IFormCommon) => {
    // @ts-expect-error nulls and undefines
    update.mutate({
      ...data,
      address,
      ...(data.dateOfBirth ? { dateOfBirth: new Date(data.dateOfBirth) } : {}),
    });
  };

  React.useEffect(() => {
    if (me) {
      reset({
        ...Object.entries(me).reduce(
          // @ts-expect-error lol
          (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
          {},
        ),
        address: me.address?.name,
        dateOfBirth: me.dateOfBirth ? formatDate(me.dateOfBirth) : undefined,
      });
      setAddress(me.address ?? undefined);
    }
  }, [me]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("firstname", {
          required: "Firstname is required",
          minLength: {
            value: 2,
            message: "Firstname must be at least 2 characters",
          },
          maxLength: {
            value: 35,
            message: "Firstname must be at less than 35 characters",
          },
        })}
        errors={errors}
        label="Firstname"
      />
      <Input
        {...register("lastname", {
          required: "Lastname is required",
          minLength: {
            value: 2,
            message: "Lastname must be at least 2 characters",
          },
          maxLength: {
            value: 35,
            message: "Lastname must be at less than 35 characters",
          },
        })}
        errors={errors}
        label="Lastname"
      />
      <Input
        {...register("dateOfBirth", {
          required: "Date of birth is required",
          valueAsDate: true,
          validate: {
            minDate: (v) => {
              const eighteenYearsAgo = new Date();
              eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
              if (v && new Date(v).getTime() <= eighteenYearsAgo.getTime()) {
                return true;
              }
              return "You must be older than 18.";
            },
            maxDate: (v) => {
              const hundredYearsAgo = new Date();
              hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
              if (v && new Date(v).getTime() > hundredYearsAgo.getTime()) {
                return true;
              }
              return "You must be younger than 100.";
            },
          },
        })}
        type="date"
        errors={errors}
        label="Date of birth"
      />
      <Input
        {...register("phone", {
          required: "Phone is required",
          pattern: {
            value: /^(\+\d{1,3})?\d{9,15}$/,
            message: "Invalid phone number",
          },
        })}
        type="tel"
        errors={errors}
        label="Phone"
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
  );
};

interface IFormDriver {
  licensePlate: string | null;
  driversLicense: string | null;
  carMaker: string | null;
  carModel: string | null;
  numberOfPassengers: number | null;
}

const DriverForm = () => {
  const utils = api.useUtils();
  const { data: me } = api.user.me.useQuery();
  const [maker, setMaker] = React.useState<string | undefined>(undefined);
  const [makerQuery, setMakerQuery] = React.useState<string | undefined>("");
  const { data: carMakers } = api.car.makers.useQuery({
    search: makerQuery ?? "",
  });
  const [model, setModel] = React.useState<string | undefined>(undefined);
  const [modelQuery, setModelQuery] = React.useState<string | undefined>("");
  const { data: carModels } = api.car.models.useQuery(
    {
      maker: maker ?? "",
      search: modelQuery ?? "",
    },
    { enabled: !!maker },
  );
  const update = api.user.update.useMutation({
    onSuccess() {
      toast("Drivers details saved!");
      void utils.user.me.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<IFormDriver>();

  const onSubmit = (data: IFormDriver) => {
    if (!maker || !model) return;
    // @ts-expect-error nulls and undefines
    update.mutate({
      ...data,
      carMaker: maker,
      carModel: model,
    });
  };

  React.useEffect(() => {
    if (me) {
      reset({
        ...Object.entries(me).reduce(
          // @ts-expect-error lol
          (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
          {},
        ),
      });
      if (me.carMaker) setMaker(me.carMaker);
      if (me.carModel) setModel(me.carModel);
    }
  }, [me]);
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("licensePlate", {
          required: "License plate is required",
          minLength: {
            value: 2,
            message: "License plate must be at least 2 characters",
          },
          maxLength: {
            value: 35,
            message: "License plate must be at less than 35 characters",
          },
        })}
        errors={errors}
        label="License plate"
      />
      <Input
        {...register("driversLicense", {
          required: "Driver's license is required",
          minLength: {
            value: 2,
            message: "Driver's license must be at least 2 characters",
          },
          maxLength: {
            value: 35,
            message: "Driver's license must be at less than 35 characters",
          },
        })}
        errors={errors}
        label="Driver's license"
      />
      <Autocomplete
        data={carMakers?.map((m) => ({ id: m, name: m })) ?? []}
        label="Car brand"
        {...register("carMaker", {
          required: "Maker is required",
        })}
        onChange={undefined}
        selected={maker ? { id: maker, name: maker } : undefined}
        setSelected={(m) => {
          setMaker(m ? m.id : undefined);
          setValue("carMaker", m ? m.id : null);
        }}
        query={makerQuery ?? ""}
        setQuery={setMakerQuery}
        errors={errors}
      />
      {maker && (
        <Autocomplete
          data={carModels?.map((m) => ({ id: m, name: m })) ?? []}
          label="Car model"
          {...register("carModel", {
            required: "Model is required",
          })}
          onChange={undefined}
          selected={model ? { id: model, name: model } : undefined}
          setSelected={(m) => {
            setModel(m ? m.id : undefined);
            setValue("carModel", m ? m.id : null);
          }}
          query={modelQuery ?? ""}
          setQuery={setModelQuery}
          errors={errors}
        />
      )}

      <Input
        {...register("numberOfPassengers", {
          required: "Number of passengers is required",
          min: 1,
          max: 6,
          valueAsNumber: true,
        })}
        type="number"
        errors={errors}
        label="Number of passenger"
        min={0}
        max={6}
      />
      <Button submit disabled={!maker || !model}>
        Submit
      </Button>
    </form>
  );
};

interface IFormPassenger {
  idNumber: string | null;
}

const PassengerForm = () => {
  const utils = api.useUtils();
  const { data: me } = api.user.me.useQuery();
  const update = api.user.update.useMutation({
    onSuccess() {
      toast("Passenger details saved!");
      void utils.user.me.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormPassenger>();

  const onSubmit = (data: IFormPassenger) => {
    // @ts-expect-error nulls and undefines
    update.mutate({
      ...data,
    });
  };

  React.useEffect(() => {
    if (me) {
      reset({
        ...Object.entries(me).reduce(
          // @ts-expect-error lol
          (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
          {},
        ),
      });
    }
  }, [me]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("idNumber", {
          required: "ID number is required",
          minLength: {
            value: 2,
            message: "License plate must be at least 2 characters",
          },
          maxLength: {
            value: 35,
            message: "License plate must be at less than 35 characters",
          },
        })}
        errors={errors}
        label="ID Number / Passport number"
      />

      <Button submit>Submit</Button>
    </form>
  );
};

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
