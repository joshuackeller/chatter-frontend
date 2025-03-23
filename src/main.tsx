import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomeScreen from "./routes/index.tsx";
import LoginScreen from "./routes/auth/login.tsx";
import AuthWrapper from "./components/layouts/AuthWrapper.tsx";
import ChatsLayout from "./components/layouts/ChatsLayout.tsx";
import ChatScreen from "./routes/[chatId].tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterScreen from "./routes/auth/register.tsx";
import WSContextProvider from "./components/layouts/WSContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WSContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthWrapper />}>
              <Route element={<ChatsLayout />}>
                <Route path="/" element={<HomeScreen />} />
                <Route path=":chatId" element={<ChatScreen />} />
              </Route>
            </Route>
            <Route path="auth">
              <Route path="login" element={<LoginScreen />} />
              <Route path="register" element={<RegisterScreen />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WSContextProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" /> */}
    </QueryClientProvider>
  </StrictMode>
);
