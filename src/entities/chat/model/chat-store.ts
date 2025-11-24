import { create } from "zustand";
import { ChatState } from "./types";

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