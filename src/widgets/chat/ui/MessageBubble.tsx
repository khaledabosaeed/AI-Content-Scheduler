"use client";
import type { Message } from "@/entities/chat";
import { SaveButton } from "@/features/chat";
import MessageActions from "./MessageActions";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "@/entities/chat";

// Skeleton loading component for AI messages
const SkeletonLoading = () => (
  <div className="flex flex-col gap-3 py-2">
    <p className="text-sm text-text-secondary animate-pulse font-medium">AI is thinking...</p>
    <div className="flex flex-col gap-2.5">
      <div className="h-3 bg-muted rounded-full w-3/4 animate-pulse"></div>
      <div className="h-3 bg-muted rounded-full w-full animate-pulse"></div>
      <div className="h-3 bg-muted rounded-full w-4/5 animate-pulse"></div>
      <div className="h-3 bg-muted rounded-full w-2/3 animate-pulse"></div>
    </div>
  </div>
);

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
  const [copied, setCopied] = useState(false);
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

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`w-full animate-fadeIn group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isAI ? (
        // AI Response - Full width with background
        <div className="w-full bg-gradient-to-r from-popover to-card border-b border-divider py-6">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Avatar className="w-10 h-10 shadow-md ring-2 ring-primary/20" title="AI Assistant">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-text-primary">AI Assistant</h3>
                  <div className="flex items-center gap-2">
                    {isStreaming && (
                      <span className="text-xs text-primary animate-pulse font-medium">responding...</span>
                    )}
                    {!isStreaming && (
                      <span className="text-sm text-text-secondary">
                        {formatTime(message.createdAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-text-primary text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {!message.content ? (
                    <SkeletonLoading />
                  ) : (
                    <>
                      {message.content}
                      {isStreaming && (
                        <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse"></span>
                      )}
                    </>
                  )}
                </div>

                {/* Action Buttons - show on hover */}
                {!isStreaming && (
                  <div
                    className={`
                      flex gap-2 items-center transition-opacity duration-200 pt-2
                      ${showActions ? "opacity-100" : "opacity-0"}
                    `}
                  >
                    {/* <button
                      onClick={handleCopy}
                      className="p-1.5 hover:bg-action-hover rounded-md transition-colors"
                      title={copied ? "Copied!" : "Copy"}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-text-secondary" />
                      )}
                    </button> */}
                    <SaveButton
                      message={message}
                      prompt={previousMessage?.content}
                    />
                    <MessageActions
                      messageId={message.id}
                      content={message.content}
                      isAI={isAI}
                      prompt={previousMessage?.content}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // User Question - Right aligned with minimal styling
        <div className="w-full px-4 md:px-6 py-6">
          <div className="max-w-4xl mx-auto flex gap-4 justify-end">
            <div className="flex-1 flex flex-col gap-2 max-w-xl items-end">
              <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-br-none shadow-md">
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
              <span className="text-xs text-text-secondary px-2">
                {formatTime(message.createdAt)}
              </span>
            </div>

            <div className="flex-shrink-0">
              <Avatar className="w-10 h-10 shadow-md ring-2 ring-secondary/20" title="You">
                <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-primary-foreground font-semibold">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
