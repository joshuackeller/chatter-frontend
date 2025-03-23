export interface Chat {
  id: string;
  name: string;
  createdAt: string;
  lastMessageContent: string | null;
  lastMessageAt: string | null;
  lastReadAt?: string | null;
}

export interface Message {
  key: {
    id: string;
    createdAt: string;
    chatId: string;
  };
  content: string;
  accountId: string;
  account?: Account | null;
}

export interface Account {
  id: string;
  name: string;
  createdAt: string;
}
