"use client";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/entities/chat";
import { useSendMessage } from "../model/use-send-message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, XIcon } from "lucide-react";

export default function ChatInput() {
  const [text, setText] = useState("");
  const { isSending, error } = useChatStore();
  const { sendMessage, cancelOngoingRequest } = useSendMessage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 200; // Max height in pixels
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSend();
      e.preventDefault();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 shadow-lg">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-3 md:py-4 space-y-2">
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <p className="text-red-600 dark:text-red-400 text-xs md:text-sm flex-1">
              {error}
            </p>
          </div>
        )}

        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={text}
            disabled={isSending}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Ctrl + Enter to send)"
            rows={1}
            className="resize-none pr-12 md:pr-14 rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all min-h-[44px] text-sm md:text-base"
          />
          {isSending ? (
            <Button
              onClick={cancelOngoingRequest}
              disabled={!isSending}
              size="sm"
              className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 md:h-9 md:w-9 p-0"
              title="Cancel Ongoing Request"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          ) :

            <Button
              onClick={handleSend}
              disabled={isSending || !text.trim()}
              size="sm"
              className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 md:h-9 md:w-9 p-0"
              title="Send (Ctrl + Enter)"
            >
              <SendIcon className="w-4 h-4" />
            </Button>
          }
        </div>

        <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-600 text-center font-light">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-mono text-[10px]">Enter</kbd> to send
        </p>


      </div>
    </div>
  );
}
