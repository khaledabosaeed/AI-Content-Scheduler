import { create } from "zustand";
import { ChatState, ChatSession } from "./types";
import { persist } from "zustand/middleware";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],

      isSending: false,

      error: null,

      currentSessionId: null,

      chatHistory: [],

      addUserMessage: (content) => {

        const state = get();
        set({
          messages: [
            ...state.messages,
            {
              id: crypto.randomUUID(),
              // sessionId:1,
              role: "user",
              content,
              createdAt: new Date().toISOString(),
            },
          ],
        });

        // Auto-create session if none exists
        if (!state.currentSessionId) {
          get().createNewSession();
        }

        // Update session with new message
        const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
        get().updateCurrentSession(title);
      },


      clearMessages: () => {
        set({ messages: [], currentSessionId: null });
      },

      setIsSending: (value) => set({ isSending: value }),

      setError: (value) => set({ error: value }),

      // Session management

      createNewSession: () => {
        const sessionId = crypto.randomUUID();
        const newSession: ChatSession = {
          id: sessionId,
          title: "New Chat",
          lastMessage: "",
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          currentSessionId: sessionId,
          chatHistory: [newSession, ...state.chatHistory],
        }));
      },

      updateCurrentSession: (title: string) => {
        const state = get();
        if (!state.currentSessionId) return;

        set({
          chatHistory: state.chatHistory.map((session) =>
            session.id === state.currentSessionId
              ? {
                ...session,
                title,
                lastMessage: title,
                updatedAt: new Date().toISOString(),
              }
              : session
          ),
        });
      },

      appendAssistantMessage: (chunk: string) => {
        set((state) => {
          const messages = [...state.messages];

          if (
            messages.length === 0 ||
            messages[messages.length - 1].role !== "assistant"
          ) {
            messages.push({
              id: crypto.randomUUID(),
              role: "assistant",
              content: chunk,
              createdAt: new Date().toISOString(),
            });
            return { messages };
          }

          const last = messages[messages.length - 1];
          last.content += chunk;

          return { messages };
        });
      },

      cencelOngoingRequest: () => {


        console.log("Ongoing request cancelled");
      },

      loadSession: (sessionId: string) => {
        // Note: In a real app, you'd load messages from a database
        // For now, we'll just switch to an empty session
        set({
          currentSessionId: sessionId,
          messages: [],
        });
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        chatHistory: state.chatHistory,
      }),
    }
  )
);