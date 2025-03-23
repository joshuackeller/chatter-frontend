import { useContext, useEffect, useRef } from "react";
import GetChatMessages, {
  ChatMessagesQueryKey,
} from "@/lib/data/chats/GetChatMessages";
import { useParams } from "react-router";
import { differenceInMinutes, formatDate, isSameDay, subDays } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import CreateChatMessage from "@/lib/data/chats/CreateChatMessage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, SendIcon } from "lucide-react";
import { Message } from "@/lib/data/interfaces";
import GetChat, { ChatQueryKey } from "@/lib/data/chats/GetChat";
import AddChatAccountModal from "@/components/modals/AddChatAccountModal";
import { Input } from "@/components/ui/input";
import { WSContext } from "@/components/layouts/WSContext";
import { v4 as uuid } from "uuid";
import useUpdateLocalData from "@/lib/data/useUpdateLocalData";
import GetSelf, { SelfQueryKey } from "@/lib/data/auth/GetSelf";

const ChatScreen = () => {
  const { chatId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendWSMessage } = useContext(WSContext);
  const { addChatMessage } = useUpdateLocalData();
  const { updateChat } = useUpdateLocalData();

  const [addAccountOpen, setAddAccountOpen] = useState<boolean>(false);

  const { data: chat } = useQuery({
    queryFn: () => GetChat(chatId || ""),
    queryKey: ChatQueryKey(chatId || ""),
    enabled: !!chatId,
  });
  const { data: messages } = useQuery({
    queryFn: () => GetChatMessages(chatId || ""),
    queryKey: ChatMessagesQueryKey(chatId || ""),
    enabled: !!chatId,
  });
  const { data: self } = useQuery({
    queryFn: GetSelf,
    queryKey: SelfQueryKey(),
  });

  const [content, setContent] = useState<string>("");
  const { mutate: createMessage, isPending } = useMutation({
    mutationFn: CreateChatMessage,
  });

  const handleCreateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!self || !chatId || !content.trim()) return;

    const messageId = uuid();

    const newMessage: Message = {
      content,
      key: {
        chatId,
        createdAt: new Date().toISOString(),
        id: messageId,
      },
      accountId: self.id,
      account: self,
    };

    sendWSMessage(newMessage);
    createMessage(
      {
        chatId,
        body: {
          messageId,
          content,
        },
      },
      {
        onSuccess: (message: Message) => {
          addChatMessage(message, true);
          setContent("");
          scrollToBottom();
        },
      }
    );
  };

  useEffect(() => {
    const handleWindowFocus = () => {
      if (chatId) {
        updateChat({
          id: chatId,
          lastReadAt: new Date().toISOString(),
        });
      }
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sortedMessages = messages
    ? [...messages].sort(
        (a, b) =>
          new Date(a.key.createdAt).getTime() -
          new Date(b.key.createdAt).getTime()
      )
    : [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 bg-zinc-800 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-100">
          {chat?.name || "Chat"}
        </h1>
        <button
          onClick={() => setAddAccountOpen(true)}
          className="cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
        <AddChatAccountModal
          chatId={chatId || ""}
          open={addAccountOpen}
          setOpen={setAddAccountOpen}
        />
      </div>
      <div className="flex-grow overflow-y-auto h-[calc(100vh-120px)] px-3 pb-1">
        <div className="flex flex-col min-h-full justify-end">
          {sortedMessages?.length === 0 ? (
            <div className="text-sm text-zinc-400 ml-1">No messages yet</div>
          ) : (
            sortedMessages?.map((message, index) => {
              const lastMessage = index > 0 ? sortedMessages[index - 1] : null;

              const isSameAsLastAccount = lastMessage
                ? message.accountId === lastMessage.accountId
                : false;
              const isWithin10Minutes = lastMessage
                ? Math.abs(
                    differenceInMinutes(
                      new Date(message.key.createdAt),
                      new Date(lastMessage.key.createdAt)
                    )
                  ) < 10
                : false;
              const shouldGroupMessages =
                isSameAsLastAccount && isWithin10Minutes;

              const isNewDay = lastMessage
                ? isSameDay(
                    new Date(lastMessage.key.createdAt),
                    subDays(new Date(message.key.createdAt), 1)
                  )
                : true;

              return (
                <div key={message.key.id}>
                  {isNewDay && (
                    <div className="flex items-center gap-x-2 mt-2 mb-4">
                      <p className="px-2 py-0.5 border border-zinc-700 text-zinc-400 rounded text-sm">
                        {formatDate(message.key.createdAt, "MMM d")}
                      </p>
                      <div className="flex-1 h-[1px] border border-zinc-700" />
                    </div>
                  )}
                  <div className="pb-2" key={message.key.id}>
                    {message.account && !shouldGroupMessages && (
                      <div className="flex gap-x-2 items-end">
                        <p className="text-sm font-semibold">
                          {message.account.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-light mb-[1px]">
                          {formatDate(message.key.createdAt, "h:mm a")}
                        </p>
                      </div>
                    )}
                    <p className="text-sm text-zinc-350">{message.content}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="px-3 pb-3">
        <form onSubmit={handleCreateMessage} className="flex gap-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || !content.trim()}
              size="icon"
            >
              <SendIcon />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
