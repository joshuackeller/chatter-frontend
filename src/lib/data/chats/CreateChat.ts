import ChatterAPI from "@/lib/ChatterAPI";
import { Chat } from "../interfaces";

const CreateChat = async ({ name }: { name: string }) => {
  const api = ChatterAPI();
  const { data } = await api.post<Chat>("/chats", { name });
  return data;
};

export default CreateChat;
