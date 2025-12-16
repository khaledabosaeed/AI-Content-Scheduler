"use client";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/entities/chat";
import { useSendMessage } from "@/features/chat/start-chat/model/use-send-message";
import MessageBubble from "./MessageBubble";
import { ChatInput } from "@/features/chat";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { BarChart3, Lightbulb, PenLine, Sparkles, Target } from "lucide-react";

export default function ChatInterface() {
  const { messages, isSending } = useChatStore();
  const { sendMessage } = useSendMessage();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSuggestionClick = (suggestion: string) => {
    if (!isSending) {
      sendMessage(suggestion);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-card to-background overflow-hidden">
      {/* Messages Container */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center justify-start min-h-full px-4 md:px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full w-full text-center pt-32 md:pt-48">
              <div className="space-y-8 w-full max-w-2xl px-4">
                <div className="space-y-3">
                  <div className=" inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary shadow-sm transition-all duration-300 hover:scale-105 hover:bg-primary/20 dark:hover:bg-primary/30 hover:shadow-md cursor-pointer">
                    <Sparkles className="w-8 h-8 stroke-[1.5]" />
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Welcome to AI Chat
                  </h1>
                  <p className="text-base md:text-lg text-text-secondary font-light">
                    Start a conversation and get intelligent answers instantly
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      icon: <PenLine className="w-7 h-7 text-primary" />,
                      title: "Write Content",
                      desc: "Get help writing professional content",
                      prompt:
                        "Help me write professional content for my social media",
                    },
                    {
                      icon: <Lightbulb className="w-7 h-7 text-primary" />,
                      title: "Creative Ideas",
                      desc: "Get fresh and innovative ideas",
                      prompt:
                        "Give me creative ideas for engaging social media posts",
                    },
                    {
                      icon: <BarChart3 className="w-7 h-7 text-primary" />,
                      title: "Analysis",
                      desc: "Analyze data and information",
                      prompt:
                        "Help me analyze my content strategy and engagement",
                    },
                    {
                      icon: <Target className="w-7 h-7 text-primary" />,
                      title: "Strategy",
                      desc: "Build an effective strategy",
                      prompt:
                        "Help me build an effective content marketing strategy",
                    },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(item.prompt)}
                      disabled={isSending}
                      className="p-4 md:p-5 rounded-xl border border-border hover:border-primary hover:bg-action-hover transition-all duration-200 text-left group shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-text-primary text-sm">
                        {item.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-4 pb-6">
              {[...messages]
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((msg, i, sortedMessages) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    previousMessage={i > 0 ? sortedMessages[i - 1] : null}
                  />
                ))}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area - Fixed at Bottom */}
      <ChatInput />
    </div>
  );
}
