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
  


  // the request stete
  isSending: boolean;
  error: string | null;
  
  // section 
  currentSessionId: string | null;
  
  chatHistory: ChatSession[];

  addUserMessage: (content: string) => void;
  // addAssistantMessage: (content: string) => void;
  
  // steaming message and response with Ai 
  appendAssistantMessage: (chunk: string) => void;
  
  
  // clearMessages: () => void;
  setIsSending: (value: boolean) => void;
  
  setError: (value: string | null) => void;

  // Session management
  createNewSession: () => void;

  updateCurrentSession: (title: string) => void;
  
  cencelOngoingRequest: () => void;
  loadSession: (sessionId: string) => void;

}
