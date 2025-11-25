export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export interface ChatState {
  messages: Message[];
  isSending: boolean;
  error: string | null;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  clearMessages: () => void;
  setIsSending: (value: boolean) => void;
  setError: (value: string | null) => void;
}
