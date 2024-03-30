import Link from "next/link";
import { Layout } from "~/components";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout>
      <div>hello world</div>
    </Layout>
  );
}
