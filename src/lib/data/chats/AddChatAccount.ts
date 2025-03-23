import ChatterAPI from "@/lib/ChatterAPI";
import { Account } from "../interfaces";

const AddChatAccount = async ({
  chatId,
  username,
}: {
  chatId: string;
  username: string;
}) => {
  const api = ChatterAPI();
  const { data } = await api.post<Account>(
    `/chats/${chatId}/accounts/${username}`
  );
  return data;
};

export default AddChatAccount;
