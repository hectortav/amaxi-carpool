import type { Trip, User, Location } from "@prisma/client";
import Link from "next/link";
import { Button, Layout } from "~/components";
import { api } from "~/utils/api";

export default function Chat() {
  const rooms = api.chat.rooms.useQuery();
  return (
    <Layout>
      <div className="mt-4 flex flex-col items-center gap-2">
        {rooms?.data?.map((room) => <RoomCard key={room.id} {...{ room }} />)}
      </div>{" "}
    </Layout>
  );
}

const RoomCard = ({
  room,
}: {
  room: Trip & { user: User; from: Location | null; to: Location | null };
}) => {
  return (
    <div className="mx-auto w-11/12 rounded-xl bg-white  p-4  sm:w-3/4">
      <div className="mb-2 flex flex-col gap-2 text-center">
        {room.from && (
          <div className="rounded-full bg-main/30 px-2">
            📍 {room.from?.name}
          </div>
        )}
        {room.to && (
          <div className="rounded-full bg-main/30 px-2">🏁 {room.to?.name}</div>
        )}
        <div className="rounded-full bg-main/30 px-2">
          📅 {room.date.toLocaleDateString("en-US")}
        </div>
        <Link href={`/chat/${room.id}`}>
          <Button className="mx-auto flex items-center gap-2">
            <span className="text-2xl">💬</span> Enter room
          </Button>
        </Link>
      </div>
    </div>
  );
};