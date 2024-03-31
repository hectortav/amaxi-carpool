import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaCar } from "react-icons/fa";
import { BiTrip } from "react-icons/bi";

function Auth() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <button
        className="group rounded-lg bg-black px-2 py-1 text-white no-underline transition hover:bg-black/80"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? <p className="text-center">Sign out</p> : "Sign in"}
      </button>
    </div>
  );
}

const Links = () => {
  const { data: session } = useSession();
  return (
    <>
      {session?.user.id && (
        <Link
          href="/trips"
          className="flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 hover:bg-secondary sm:flex-row"
        >
          <span className="sm:text-md text-2xl">
            <FaCar className="h-6 w-6" />
          </span>
          <span className="sm:text-md text-xs">My Trips</span>
        </Link>
      )}
      <Link
        href="/join-trips"
        className="flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 hover:bg-secondary sm:flex-row"
      >
        <span className="sm:text-md text-2xl">
          <BiTrip className="h-6 w-6" />
        </span>
        <span className="sm:text-md text-xs">Join Trips</span>
      </Link>
      {session?.user.id && (
        <>
          <Link
            href="/chat"
            className="flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 hover:bg-secondary sm:flex-row"
          >
            <span className="sm:text-md text-2xl">
              <IoChatbubbleEllipsesOutline className="h-6 w-6" />
            </span>
            <span className="sm:text-md text-xs">Chat</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 hover:bg-secondary sm:flex-row"
          >
            <span className="sm:text-md text-2xl">
              <CgProfile className="h-6 w-6" />
            </span>
            <span className="sm:text-md text-xs">Profile</span>
          </Link>
        </>
      )}
    </>
  );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>🚗 Amaxi</title>
        <meta name="description" content="Amaxi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="sticky hidden h-16 items-center bg-secondary/20 px-4 py-2 sm:flex">
        <div className="mr-auto">
          <Link href="/">
            <p className="font-semibold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="logo" className="h-12 w-12" />
            </p>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Links />
        </div>
        <div className="ml-2 flex items-center gap-2">
          <Auth />
        </div>
      </nav>
      <main className="flex h-16 min-h-screen flex-col">{children}</main>
      <nav className="sticky bottom-0 flex items-center bg-secondary/20 px-4 py-2 sm:hidden">
        <div className="flex w-full items-center justify-between">
          <Links />
          {!session?.user.id && (
            <div className="ml-2 flex items-center gap-2">
              <Auth />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Layout;
