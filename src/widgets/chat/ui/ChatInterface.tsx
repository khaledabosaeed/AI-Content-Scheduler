"use client";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/entities/chat";
import MessageBubble from "./MessageBubble";
import { ChatInput } from "@/features/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatInterface() {
  const { messages } = useChatStore();
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="font-bold text-xl text-gray-900 dark:text-white">AI Chat Assistant</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Powered by Advanced AI</p>
        </div>
      </header>

      {/* Messages Container */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center justify-start min-h-full px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full w-full text-center py-20">
              <div className="space-y-8 w-full max-w-2xl">
                <div className="space-y-3">
                  <div className="text-7xl animate-bounce">💬</div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                    Welcome to AI Chat
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
                    Start a conversation and get intelligent answers instantly
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon: "✍️", title: "Write Content", desc: "Get help writing professional content" },
                    { icon: "💡", title: "Creative Ideas", desc: "Get fresh and innovative ideas" },
                    { icon: "📊", title: "Analysis", desc: "Analyze data and information" },
                    { icon: "🎯", title: "Strategy", desc: "Build an effective strategy" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 text-left group shadow-sm hover:shadow-md"
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-6 pb-24">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  previousMessage={i > 0 ? messages[i - 1] : null}
                />
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 backdrop-blur-sm sticky bottom-0 shadow-lg">
          <ChatInput />
      </div>
    </div>
  );
}
