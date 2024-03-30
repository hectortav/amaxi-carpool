import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

function Auth() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <button
        className="group rounded-lg bg-black px-2 py-1 text-white no-underline transition hover:bg-black/80"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        <p className="text-center group-hover:hidden">
          {sessionData && <span>{sessionData.user?.name}</span>}
        </p>
        {sessionData ? (
          <p className="hidden text-center group-hover:block">Sign out</p>
        ) : (
          "Sign in"
        )}
      </button>
    </div>
  );
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Amaxi</title>
        <meta name="description" content="Amaxi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="flex items-center bg-black/5 px-4 py-2">
        <div className="mr-auto">
          <Link href="/">
            <p className="font-semibold">Amaxi</p>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/trips">Trips</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/profile">Profile</Link>
          <Auth />
        </div>
      </nav>
      <main className=" flex min-h-screen flex-col items-center justify-center">
        {children}
      </main>
    </>
  );
};

export default Layout;
