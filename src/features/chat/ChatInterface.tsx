"use client";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/entities/chat";
import MessageBubble from "./MessageBubble";
import ChatInput from "./start-chat/ui/ChatInput";
import ClearButton from "./clear-chat/ui/ClearButton";

export default function ChatInterface() {
  const { messages } = useChatStore();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] border rounded-lg overflow-hidden">
      <header className="p-3 bg-black text-white flex justify-between items-center">
        <h2 className="font-semibold">💬 محادثة AI</h2>
        <ClearButton />
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>ابدأ المحادثة مع الذكاء الاصطناعي 🤖</p>
          </div>
        )}

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
