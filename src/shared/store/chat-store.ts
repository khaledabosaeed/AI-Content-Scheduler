import { create } from "zustand";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

interface ChatState {
  messages: Message[];
  isSending: boolean;
  error: string | null;

  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  clearMessages: () => void;
  setIsSending: (value: boolean) => void;
  setError: (value: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isSending: false,
  error: null,

  addUserMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          role: "user",
          content,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  addAssistantMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  clearMessages: () => set({ messages: [] }),

  setIsSending: (value) => set({ isSending: value }),
  setError: (value) => set({ error: value }),
}));
