import ChatterAPI from "@/lib/ChatterAPI";
import { Account } from "../interfaces";

const GetSelf = async () => {
  const api = ChatterAPI();
  const { data } = await api.get<Account>("/self");

  return data;
};

export default GetSelf;

export const SelfQueryKey = () => ["self"];
