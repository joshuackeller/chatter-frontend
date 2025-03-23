import ChatterAPI from "@/lib/ChatterAPI";
import { AUTH_TOKEN_KEY } from "@/lib/utils";

const Register = async (body: {
  name: string;
  username: string;
  password: string;
}) => {
  const api = ChatterAPI();
  const { data: token } = await api.post<string>(`/auth/register`, body);

  localStorage.setItem(AUTH_TOKEN_KEY, token);

  return token;
};

export default Register;
