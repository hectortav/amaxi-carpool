import React from "react";
import { toast } from "react-toastify";
import { Button, Layout } from "~/components";
import { api } from "~/utils/api";

export default function Admin() {
  const company = api.company.get.useQuery();
  return (
    <Layout>
      <div className="mx-auto mt-4 flex w-2/3 flex-col gap-2 rounded-xl bg-white p-4">
        <div className="flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={company.data?.logo}
            alt="logo"
            className="w-1/3 object-cover"
          />
          <h1 className="text-2xl font-semibold">{company.data?.name}</h1>
        </div>
        <div className="flex items-center justify-end">
          <Button
            onClick={() => {
              void navigator.clipboard.writeText(
                `${window.location.origin}/join/${company.data?.code}`,
              );
              toast("Link copied!");
            }}
          >
            Copy invite link
          </Button>
        </div>
      </div>
      <div className="mx-auto mt-4 flex w-2/3 flex-col gap-2 rounded-xl bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="mx-auto text-center text-2xl font-semibold">
            Statistics
          </h1>
        </div>
        <div className="flex flex-col">
          <div>Employees joined: 95</div>
          <div>
            Cars used: 37 (<span className="text-green-400">↑ 3</span>)
          </div>
          <div>
            Mean employees per car: 2.56 (
            <span className="text-green-400">↓ 0.23</span>)
          </div>

          <div>
            CO2 saved this month: 10051.5 (
            <span className="text-green-400">↑ 211</span>)
          </div>
        </div>
      </div>
    </Layout>
  );
}
