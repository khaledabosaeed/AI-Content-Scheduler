"use client";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/shared/store/chat-store"
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

export default function ChatInterface() {
  const { messages, clearMessages } = useChatStore();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] border rounded-lg overflow-hidden">
      <header className="p-3 bg-black text-white flex justify-between items-center">
        <h2 className="font-semibold">AI Chat</h2>
        <button
          onClick={clearMessages}
          className="bg-red-600 px-3 py-1 rounded text-sm"
        >
          Clear
        </button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            previousMessage={i > 0 ? messages[i - 1] : null}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      <ChatInput />
    </div>
  );
}
