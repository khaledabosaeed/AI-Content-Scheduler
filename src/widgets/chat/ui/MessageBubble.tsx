"use client";
import type { Message } from "@/entities/chat";
import { SaveButton } from "@/features/chat";

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
    <div className={`w-full flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`p-3 rounded-lg max-w-[70%] text-sm shadow-md ${isAI ? "bg-gray-200" : "bg-blue-500 text-white"
          }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        {isAI && (
          <SaveButton
            message={message}
            prompt={previousMessage?.content}
          />
        )}
      </div>
    </div>
  );
}
