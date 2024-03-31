import { useRouter } from "next/router";
import React from "react";

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      void router.push("/join-trips");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-main">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="logo" className="h-64 w-64" />
    </div>
  );
}
