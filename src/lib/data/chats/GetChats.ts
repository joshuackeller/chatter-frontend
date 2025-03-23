import ChatterAPI from "@/lib/ChatterAPI";
import { Chat } from "../interfaces";

const GetChats = async () => {
  const api = ChatterAPI();
  const { data } = await api.get<Chat[]>("/chats");
  return data;
};

export default GetChats;

export const ChatsQueryKey = () => ["chats"];
