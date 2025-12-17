// src/entities/chat/model/chat-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatState, ChatSession, Message } from "./types";
import { api } from "@/shared/api/api-client";

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

        // ❗ ما منلعبش في السيشن هنا
        // السيشن تتسجل فعليًا في Supabase من خلال saveCurrentSession
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

      //========== إدارة السيشن ==========//

      createNewSession: () => {
        set({
          currentSessionId: null,
          messages: [],
          error: null,
        });
      },

      // حالياً مش أساسي، بس موجود لو حبيتي تعدلي العنوان محلياً
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

      //========== تحميل محادثة من Supabase ==========//
      // GET /api/chat/get-chat?sessionId=...
      loadSession: async (sessionId: string) => {
        set({
          isLoadingSession: true,
          error: null,
          currentSessionId: sessionId,
        });

        try {
          const res = await api.get(`chat/get-chat?sessionId=${sessionId}`, {
          });

          const data =  res;

          //  نضمن إن كل رسالة ليها id مش null
          const messages: Message[] = (data.messages ?? []).map(
            (m: any, index: number) => ({
              id: m.id ?? `msg-${data.sessionId}-${index}`,
              role: m.role,
              content: m.content,
              createdAt: m.createdAt ?? new Date().toISOString(),
            })
          );

          set({
            messages,
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

      //========== حفظ المحادثة في Supabase ==========//
      // POST /api/chat/add-chat
      saveCurrentSession: async () => {
        const state = get();
        const { currentSessionId, messages, chatHistory } = state;

        if (messages.length === 0) return;

        // -------- 1) نحسب lastMessage عادي --------
        const lastUserMessage = [...messages]
          .reverse()
          .find((m) => m.role === "user");

        const lastAssistantMessage = [...messages]
          .reverse()
          .find((m) => m.role === "assistant");

        const lastMessage =
          lastAssistantMessage?.content ??
          lastUserMessage?.content ??
          messages[messages.length - 1].content;

        // -------- 2) نحدد الـ title --------
        let title: string;

        const existingSession = currentSessionId
          ? chatHistory.find((s) => s.id === currentSessionId)
          : null;

        if (!currentSessionId || !existingSession) {
          // ⭐ أول مرة نحفظ السيشن → نستخدم أول رسالة user كعنوان
          const firstUserMessage =
            messages.find((m) => m.role === "user") ?? messages[0];

          const titleSource = firstUserMessage.content;

          title =
            titleSource.length > 30
              ? titleSource.slice(0, 30) + "..."
              : titleSource;
        } else {
          // ⭐ سيشن موجودة بالفعل → حافظ على نفس العنوان، لا تغيّره
          title = existingSession.title;
        }

        try {
          const res = await fetch("/api/chat/add-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: currentSessionId, // null أول مرة → INSERT، بعدين → UPDATE
              title,
              lastMessage,
              messages,
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to save chat session");
          }

          const data = await res.json();

          const newSession: ChatSession = {
            id: data.id,
            title: data.title,
            lastMessage: data.lastMessage,
            updatedAt: data.updatedAt,
          };

          set((state) => ({
            currentSessionId: data.id,
            chatHistory: [
              newSession,
              ...state.chatHistory.filter((s) => s.id !== data.id),
            ],
          }));
        } catch (err: any) {
          console.error("saveCurrentSession error:", err);
          set({ error: err?.message ?? "Failed to save chat session" });
        }
      },

      //========== تحميل الهستوري من Supabase ==========//
      // GET /api/chat/history
      fetchChatHistory: async () => {
        set({ isLoadingHistory: true, error: null });

        try {
          const res = await fetch("/api/chat/history");

          if (!res.ok) throw new Error("Failed to load history");

          const data = await res.json();
          console.log("history data:", data);

          const safeSessions = (data.sessions || []).filter(
            (s: any) => s.id !== null && s.id !== undefined
          );

          set({
            chatHistory: safeSessions,
            isLoadingHistory: false,
          });
        } catch (err: any) {
          console.error("History error:", err);
          set({
            isLoadingHistory: false,
            error: err?.message ?? "Failed to load history",
          });
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
      }),
    }
  )
);
