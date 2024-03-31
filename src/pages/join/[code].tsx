import { useRouter } from "next/router";
import { Button, Layout } from "~/components";
import { api } from "~/utils/api";

export default function Join() {
  const router = useRouter();
  const company = api.company.get.useQuery(
    { code: router.query.code as string },
    { enabled: typeof router.query.code === "string" },
  );
  return (
    <Layout>
      <div className="mt-4 flex w-full flex-col text-center">
        <div className="mx-auto flex w-11/12 flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 sm:w-2/3">
          <h1 className="text-3xl font-semibold">Welcome onboard!</h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={company.data?.logo}
            alt="logo"
            className="w-1/3 object-cover"
          />
          <Button onClick={() => router.push("/join-trips")}>View trips</Button>
        </div>
      </div>
    </Layout>
  );
}
