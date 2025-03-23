import { Message } from "@/lib/data/interfaces";
import useUpdateLocalData from "@/lib/data/useUpdateLocalData";
import { getAuthToken } from "@/lib/utils";
import { createContext, ReactNode, useEffect, useState } from "react";

interface WSContextProps {
  sendWSMessage: (message: Message) => void;
}

export const WSContext = createContext<WSContextProps>({} as WSContextProps);

const WSContextProvider = ({ children }: { children: ReactNode }) => {
  const { addChatMessage } = useUpdateLocalData();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const authToken = getAuthToken();

  useEffect(() => {
    if (!!authToken && (!socket || socket.CLOSED)) {
      const ws = new WebSocket(`ws://localhost:8080/ws?token=${authToken}`);
      setSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        console.log("WS EVENT", event);
        try {
          const message: Message = JSON.parse(event.data);
          console.log("THE MESSAGE", message);
          addChatMessage(message);
        } catch {
          console.error("Could not parse message");
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        ws.close();
      };
    }
  }, [authToken, socket?.CLOSED]);

  const sendWSMessage = (message: Message) => {
    if (socket) {
      socket.send(JSON.stringify(message));
      console.log("WS MESSAGE SENT");
    }
  };

  return (
    <WSContext.Provider value={{ sendWSMessage }}>
      {children}
    </WSContext.Provider>
  );
};

export default WSContextProvider;
