import ChatterAPI from "@/lib/ChatterAPI";
import { AUTH_TOKEN_KEY } from "@/lib/utils";

const Login = async (body: { username: string; password: string }) => {
  const api = ChatterAPI();
  const { data: token } = await api.post<string>(`/auth/login`, body);

  localStorage.setItem(AUTH_TOKEN_KEY, token);

  return token;
};

export default Login;
