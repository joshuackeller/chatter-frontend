import ChatterAPI from "@/lib/ChatterAPI";
import { Message } from "../interfaces";
import { ChatQueryKey } from "./GetChat";

const GetChatMessages = async (chatId: string) => {
  const api = ChatterAPI();
  const { data } = await api.get<Message[]>(`/chats/${chatId}/messages`);
  return data;
};

export default GetChatMessages;

export const ChatMessagesQueryKey = (chatId: string) => [
  ChatQueryKey(chatId),
  "messages",
];
