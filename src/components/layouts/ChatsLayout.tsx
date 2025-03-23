import GetChats from "@/lib/data/chats/GetChats";
import { cn, signOut } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useNavigate, useParams } from "react-router";
import { LogOutIcon, PlusIcon } from "lucide-react";
import CreateChatModal from "../modals/CreateChatModal";
import { useState } from "react";
import { isBefore } from "date-fns";
import { Button } from "../ui/button";
import useUpdateLocalData from "@/lib/data/useUpdateLocalData";

const ChatsLayout = () => {
  const navigate = useNavigate();
  const { updateChat } = useUpdateLocalData();

  const { data: chats } = useQuery({ queryFn: GetChats, queryKey: ["chats"] });
  const { chatId } = useParams();

  const [createOpen, setCreateOpen] = useState<boolean>(false);

  if (!chats) return <div>loading chats...</div>;
  return (
    <div className="flex h-screen">
      <div className="h-screen overflow-y-scroll p-3 w-72 bg-zinc-850">
        <div className="flex justify-between">
          <h1 className="font-semibold ml-1 mb-1">Chatter</h1>
          <button className="cursor-pointer">
            <PlusIcon className="h-5 w-5" onClick={() => setCreateOpen(true)} />
          </button>
          <CreateChatModal open={createOpen} setOpen={setCreateOpen} />
        </div>
        {chats.length === 0 ? (
          <div className="text-sm">No chats found</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "p-1 pr-3 rounded cursor-pointer",
                chatId === chat.id && "bg-zinc-100/20"
              )}
              onClick={() => {
                updateChat({
                  id: chat.id,
                  lastReadAt: new Date().toISOString(),
                });
                navigate(`/${chat.id}`);
              }}
            >
              <div className="flex gap-x-2 items-center">
                {!!chat.lastReadAt &&
                !!chat.lastMessageAt &&
                isBefore(
                  new Date(chat.lastReadAt),
                  new Date(chat.lastMessageAt)
                ) ? (
                  <div className="h-2 w-2 bg-indigo-500 rounded-full" />
                ) : (
                  <div className="h-2 w-2" />
                )}
                <div>
                  <p className="text-sm font-semibold line-clamp-1">
                    {chat.name}
                  </p>
                  <p className="line-clamp-1 text-[10px] max-w-56">
                    {chat.lastMessageContent || "No messages"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div className="mt-2">
          <Button
            className="w-full text-xs"
            size="sm"
            variant="ghost"
            onClick={() => {
              signOut();
              navigate("/auth/login");
            }}
          >
            Log Out
            <LogOutIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatsLayout;
