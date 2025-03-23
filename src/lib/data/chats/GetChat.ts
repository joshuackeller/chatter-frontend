import ChatterAPI from "@/lib/ChatterAPI";
import { Chat } from "../interfaces";
import { ChatsQueryKey } from "./GetChats";

const GetChat = async (chatId: string) => {
  const api = ChatterAPI();
  const { data } = await api.get<Chat>(`/chats/${chatId}`);
  return data;
};

export default GetChat;

export const ChatQueryKey = (chatId: string) => [...ChatsQueryKey(), chatId];
