export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ChatSession = {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
};

export interface ChatState {
  messages: Message[];
  isSending: boolean;
  error: string | null;
  currentSessionId: string | null;
  chatHistory: ChatSession[];

  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  appendAssistantMessage: (chunk: string) => void;
  clearMessages: () => void;
  setIsSending: (value: boolean) => void;
  setError: (value: string | null) => void;

  // Session management
  createNewSession: () => void;
  updateCurrentSession: (title: string) => void;
  loadSession: (sessionId: string) => void;
}
