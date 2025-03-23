import ChatterAPI from "@/lib/ChatterAPI";
import { Message } from "../interfaces";

const CreateChatMessage = async ({
  chatId,
  body,
}: {
  chatId: string;
  body: { messageId: string; content: string };
}) => {
  const api = ChatterAPI();
  const { data } = await api.post<Message>(`/chats/${chatId}/messages`, body);
  return data;
};

export default CreateChatMessage;
