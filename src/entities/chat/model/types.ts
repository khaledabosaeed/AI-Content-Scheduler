export type Message = {
  id: string;
  // sessionId:number,
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};


/****
 * 
 * load the caht from the chat session
 * add this arry to the cahthistru 
 * loop on the caht arry to display the messages
 * click on titel load the session messages
 * tow endpoint 
 * api/chat/get-chat 
 * api/chat/add-chat
 * 
 */

export type ChatSession = {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
};

export interface ChatState {
  // message map if  role: "user" | "assistant" selcet what ecach one display  
  messages: Message[];

  // cahthistru: Message[];

  // the request stete
  isSending: boolean;

  error: string | null;
  
  // section 
  currentSessionId: string | null;
  chatHistory: ChatSession[];

  // message management
  addUserMessage: (content: string) => void;
  
  appendAssistantMessage: (chunk: string) => void;
  
  clearMessages: () => void;


  setIsSending: (value: boolean) => void;

  setError: (value: string | null) => void;

  // Session management
  createNewSession: () => void;

  updateCurrentSession: (title: string) => void;
  
  loadSession: (sessionId: string) => void;
  
  
  // AbortController
  controller: AbortController | null;
  
  setController: (c: AbortController | null) => void;
  
  cancelOngoingRequest: () => void;

}
