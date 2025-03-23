import axios from "axios";
import { AUTH_TOKEN_KEY } from "./utils";

const ChatterAPI = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
};

export default ChatterAPI;
