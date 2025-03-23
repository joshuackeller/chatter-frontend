import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AUTH_TOKEN_KEY = "AUTH_TOKEN";

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const signOut = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};
