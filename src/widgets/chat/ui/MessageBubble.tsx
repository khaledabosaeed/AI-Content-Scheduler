"use client";
import type { Message } from "@/entities/chat";
import { SaveButton } from "@/features/chat";
import MessageActions from "./MessageActions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "@/entities/chat";

interface MessageBubbleProps {
  message: Message;
  previousMessage?: Message | null;
}

export default function MessageBubble({
  message,
  previousMessage,
}: MessageBubbleProps) {
  const isAI = message.role === "assistant";
  const [showActions, setShowActions] = useState(false);
  const { isSending, messages } = useChatStore();

  // Check if this is the last message and currently streaming
  const isLastMessage = messages[messages.length - 1]?.id === message.id;
  const isStreaming = isAI && isLastMessage && isSending;

  // Format timestamp 
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div
      className={`w-full flex gap-3 ${isAI ? "justify-start" : "justify-end"} animate-fadeIn group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isAI && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className="w-8 h-8 shadow-sm ring-2 ring-blue-100 dark:ring-blue-900/30" title="AI Assistant">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[75%] md:max-w-[65%] ${isAI ? "" : "items-end"}`}>
        <div
          className={`
            relative px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200
            ${isAI
              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-md shadow-md"
              : "bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-600 dark:to-blue-700 text-white rounded-tr-md shadow-md"
            }
            hover:shadow-lg transform hover:-translate-y-0.5
          `}
        >
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed font-normal">
            {message.content}
            {/* Typing cursor - shown only while streaming */}
            {isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse"></span>
            )}
          </p>

          {/* Timestamp - bottom right corner */}
          {!isStreaming && (
            <div
              className={`
                text-[10px] mt-1 flex items-center justify-end gap-1
                ${isAI
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-blue-100 dark:text-blue-200"
                }
              `}
            >
              <span className="font-medium">{formatTime(message.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons - show on hover */}
        {!isStreaming && (
          <div
            className={`
              flex gap-1 items-center px-1 transition-opacity duration-200
              ${showActions ? "opacity-100" : "opacity-0"}
              ${isAI ? "justify-start" : "justify-end"}
            `}
          >
            {isAI && (
              <SaveButton
                message={message}
                prompt={previousMessage?.content}
              />
            )}
            <MessageActions
              messageId={message.id}
              content={message.content}
              isAI={isAI}
              prompt={previousMessage?.content}
            />
          </div>
        )}
      </div>

      {!isAI && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className="w-8 h-8 shadow-sm ring-2 ring-green-100 dark:ring-green-900/30" title="You">
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}
