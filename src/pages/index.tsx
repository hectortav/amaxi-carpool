import { Layout } from "~/components";

export default function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-main">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="logo" className="h-64 w-64" />
    </div>
  );
}
