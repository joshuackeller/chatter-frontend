import { useQueryClient } from "@tanstack/react-query";
import { Chat, Message } from "./interfaces";
import { produce } from "immer";
import { ChatsQueryKey } from "./chats/GetChats";
import { ChatQueryKey } from "./chats/GetChat";
import { ChatMessagesQueryKey } from "./chats/GetChatMessages";

const useUpdateLocalData = () => {
  const queryClient = useQueryClient();

  const addChatMessage = (message: Message, isSender?: boolean) => {
    queryClient.setQueryData(
      ChatMessagesQueryKey(message.key.chatId),
      (prev: Message[] = []) => {
        if (!prev.some((m) => m.key.id === message.key.id)) {
          return [...prev, message];
        }
        return prev;
      }
    );

    updateChat({
      id: message.key.chatId,
      lastMessageContent: message.content,
      lastMessageAt: message.key.createdAt,
      lastReadAt: isSender ? message.key.createdAt : undefined,
    });
  };

  const updateChat = (chat: {
    id: string;
    lastMessageContent?: string;
    lastMessageAt?: string;
    lastReadAt?: string;
  }) => {
    queryClient.setQueryData(ChatsQueryKey(), (prev: Chat[]) => {
      return produce(prev, (draft) => {
        for (let i = 0; i < draft.length; i++) {
          if (draft[i].id === chat.id) {
            if (chat.lastMessageContent) {
              draft[i].lastMessageContent = chat.lastMessageContent;
            }
            if (chat.lastMessageAt) {
              draft[i].lastMessageAt = chat.lastMessageAt;
            }
            if (chat.lastReadAt) {
              draft[i].lastReadAt = chat.lastReadAt;
            }
          }
          break;
        }
      });
    });
    queryClient.setQueryData(ChatQueryKey(chat.id), (prev: Chat) => ({
      ...prev,
      ...chat,
    }));
  };

  return {
    addChatMessage,
    updateChat,
  };
};

export default useUpdateLocalData;
