export type Message = {
  id: string;
  // sessionId:number,
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
  // message map if  role: "user" | "assistant" selcet what ecach one display
  messages: Message[];

  // request state
  isSending: boolean;

  error: string | null;

  //  NEW: loading flags
  isLoadingHistory: boolean;
  isLoadingSession: boolean;

  // sessions
  currentSessionId: string | null;
  chatHistory: ChatSession[];

  // message management
  addUserMessage: (content: string) => void;
  appendAssistantMessage: (chunk: string) => void;
  clearMessages: () => void;

  // NEW: set messages بعد ما نجيبها من API
  setMessages: (messages: Message[]) => void;

  setIsSending: (value: boolean) => void;
  setError: (value: string | null) => void;

  // Session management
  createNewSession: () => void;
  fetchChatHistory: () => void;
  updateCurrentSession: (title: string) => void;
  loadSession: (sessionId: string) => Promise<void>;

  //  NEW: helpers للسيشنز والـ history
  setCurrentSessionId: (sessionId: string | null) => void;
  setChatHistory: (sessions: ChatSession[]) => void;
  addSessionToHistory: (session: ChatSession) => void;
  updateSessionInHistory: (
    sessionId: string,
    patch: Partial<ChatSession>
  ) => void;

  //  (اختياري) ربط بالـ /api/chat/add-chat
  saveCurrentSession?: () => Promise<void>;

  // AbortController
  controller: AbortController | null;
  setController: (c: AbortController | null) => void;
  cancelOngoingRequest: () => void;
}
