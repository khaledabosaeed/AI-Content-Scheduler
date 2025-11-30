"use client";
import type { Message } from "@/entities/chat";
import { SaveButton } from "@/features/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: Message;
  previousMessage?: Message | null;
}

export default function MessageBubble({
  message,
  previousMessage,
}: MessageBubbleProps) {
  const isAI = message.role === "assistant";

  return (
    <div className={`w-full flex gap-3 ${isAI ? "justify-start" : "justify-end"} animate-fadeIn`}>
      {isAI && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className="w-9 h-9 shadow-md" title="AI Assistant">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xs">
              AI
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className={`flex flex-col gap-2 max-w-[85%] ${isAI ? "" : "items-end"}`}>
        <div
          className={`px-5 py-3 rounded-3xl shadow-sm transition-all hover:shadow-md ${
            isAI
              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none"
              : "bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-600 dark:to-blue-700 text-white rounded-tr-none"
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </p>
        </div>

        {isAI && (
          <div className="mt-1 px-2 flex gap-1">
            <SaveButton
              message={message}
              prompt={previousMessage?.content}
            />
          </div>
        )}
      </div>

      {!isAI && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className="w-9 h-9 shadow-md" title="You">
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-xs">
              You
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}
