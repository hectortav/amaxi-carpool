import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button, Input, Layout } from "~/components";
import { api } from "~/utils/api";

export default function ChatRoom() {
  const router = useRouter();
  const urils = api.useUtils();
  const [text, setText] = React.useState("");
  const send = api.chat.send.useMutation({
    onSuccess() {
      setText("");
      void urils.chat.get.invalidate();
    },
  });
  const messages = api.chat.get.useQuery(
    {
      tripId: router.query.tripId as string,
    },
    { enabled: typeof router.query.tripId === "string", refetchInterval: 1000 },
  );
  return (
    <Layout>
      <div className="flex h-screen">
        <div className="mx-auto h-3/4  w-full sm:w-3/4">
          <div className="mt-4 flex h-full w-full flex-col items-center gap-2">
            {messages?.data?.map((message) => (
              <Message
                key={message.id}
                text={message.text}
                userId={message.user.id}
                name={message.user.firstname ?? message.user.name ?? ""}
                createdAt={message.createdAt}
              />
            ))}
          </div>
          <div className="mx-auto flex w-11/12 items-center gap-4 sm:w-3/4">
            <div className="w-full">
              <Input
                name="text"
                className="flex w-full"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <Button
                onClick={() =>
                  send.mutate({
                    tripId: router.query.tripId as string,
                    text,
                  })
                }
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const Message = ({
  text,
  userId,
  name,
  createdAt,
}: {
  text: string;
  userId: string;
  name: string;
  createdAt: Date;
}) => {
  const { data: session } = useSession();

  return (
    <div className="mx-auto flex w-11/12 sm:w-3/4">
      <div
        className={`inline-block rounded-xl p-4 ${session?.user.id === userId ? "ml-auto bg-main text-white" : "mr-auto bg-white text-main"}`}
      >
        {session?.user.id !== userId && (
          <span className="text-right text-sm">{name}</span>
        )}
        <div className="w-full">{text}</div>
        <span className="text-right text-sm">
          {createdAt.toLocaleDateString("en-US")}
        </span>
      </div>
    </div>
  );
};
