// src/entities/chat/model/chat-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatState, ChatSession, Message } from "./types";

/***
 *
 * OM ALNOOR you can use this store to manage chat state in your application.
 *
 */
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isSending: false,
      error: null,
      isLoadingSession: false,
      isLoadingHistory: false,

      currentSessionId: null,
      controller: null,
      chatHistory: [],

      //========== Setters بسيطة ==========//
      setMessages: (messages: Message[]) => set({ messages }),
      setChatHistory: (sessions: ChatSession[]) =>
        set({ chatHistory: sessions }),

      addSessionToHistory: (session: ChatSession) =>
        set((state) => ({
          chatHistory: [session, ...state.chatHistory],
        })),

      setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),

      updateSessionInHistory: (sessionId, patch) => {
        set((state) => ({
          chatHistory: state.chatHistory.map((s) =>
            s.id === sessionId ? { ...s, ...patch } : s
          ),
        }));
      },

      setIsSending: (value) => set({ isSending: value }),
      setError: (value) => set({ error: value }),

      //========== إدارة الرسائل ==========//
      addUserMessage: (content) => {
        const state = get();

        const newMessage: Message = {
          id: crypto.randomUUID(),
          role: "user",
          content,
          createdAt: new Date().toISOString(),
        };

        set({
          messages: [...state.messages, newMessage],
        });

        // لو مفيش سيشن حالية نعمل واحدة جديدة
        if (!state.currentSessionId) {
          get().createNewSession();
        }

        // نحدِّث عنوان السيشن
        const title =
          content.length > 30 ? content.slice(0, 30) + "..." : content;
        get().updateCurrentSession(title);
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

      clearMessages: () => {
        set({ messages: [], currentSessionId: null });
      },

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

      // load the chat from the chat session (GET /api/chat/get-chat)
      loadSession: async (sessionId: string) => {
        set({
          isLoadingSession: true,
          error: null,
          currentSessionId: sessionId,
        });

        try {
          const res = await fetch(`/api/chat/get-chat?sessionId=${sessionId}`, {
            method: "GET",
          });

          if (!res.ok) {
            throw new Error("Failed to load chat");
          }

          const data = await res.json();
          // نتوقع { messages: Message[] }
          set({
            messages: data.messages ?? [],
            isLoadingSession: false,
          });
        } catch (err: any) {
          console.error("loadSession error:", err);
          set({
            isLoadingSession: false,
            error: err?.message ?? "Failed to load chat",
          });
        }
      },

      // save to /api/chat/add-chat
      saveCurrentSession: async () => {
        const state = get();
        const { currentSessionId, messages, chatHistory } = state;

        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1].content;

        const currentSession = chatHistory.find(
          (s) => s.id === currentSessionId
        );

        const title =
          currentSession?.title ??
          (lastMessage.length > 30
            ? lastMessage.slice(0, 30) + "..."
            : lastMessage);

        try {
          const res = await fetch("/api/chat/add-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: currentSessionId, // ممكن يكون null أول مرة
              title,
              lastMessage,
              messages,
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to save chat session");
          }

          const data = await res.json();
          // نتوقع { id, title, lastMessage, updatedAt }

          if (!currentSessionId) {
            // سيشن جديدة
            const newSession: ChatSession = {
              id: data.id,
              title: data.title,
              lastMessage: data.lastMessage,
              updatedAt: data.updatedAt,
            };

            set((state) => ({
              currentSessionId: data.id,
              chatHistory: [newSession, ...state.chatHistory],
            }));
          } else {
            // سيشن موجودة
            set((state) => ({
              chatHistory: state.chatHistory.map((s) =>
                s.id === currentSessionId
                  ? {
                      ...s,
                      title: data.title,
                      lastMessage: data.lastMessage,
                      updatedAt: data.updatedAt,
                    }
                  : s
              ),
            }));
          }
        } catch (err: any) {
          console.error("saveCurrentSession error:", err);
          set({ error: err?.message ?? "Failed to save chat session" });
        }
      },

      //========== AbortController ==========//
      setController: (c) => set({ controller: c }),

      cancelOngoingRequest: () => {
        const c = get().controller;
        if (c) {
          c.abort();
          set({ controller: null, isSending: false });
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        chatHistory: state.chatHistory,
        // تقدري تضيفي currentSessionId لو حابة تحفظي آخر سيشن
        // currentSessionId: state.currentSessionId,
      }),
    }
  )
);
