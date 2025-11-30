"use client";
import { useState } from "react";
import { useChatStore } from "@/entities/chat";
import { useSendMessage } from "../model/use-send-message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function ChatInput() {
  const [text, setText] = useState("");
  const { isSending, error } = useChatStore();
  const { sendMessage } = useSendMessage();

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
    <div className="w-full max-w-4xl mx-auto px-6 py-4 space-y-3">
      <div className="relative">
        <Textarea
          value={text}
          disabled={isSending}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here... (Ctrl + Enter to send)"
          rows={3}
          className="resize-none pr-14 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all"
        />
        <Button
          onClick={handleSend}
          disabled={isSending || !text.trim()}
          size="sm"
          className="absolute bottom-3 left-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          title="Send (Ctrl + Enter)"
        >
          <SendIcon className="w-5 h-5" />
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <p className="text-red-600 dark:text-red-400 text-sm flex-1">
            {isSending ? "Sending..." : error}
          </p>
        </div>
      )}

      <div className="flex gap-2 justify-between">
        <Link href="/dashboard" className="flex-1">
          <Button
            variant="outline"
            className="w-full gap-2 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800"
            type="button"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-500 text-center font-light">
        💡 Tip: Press Ctrl + Enter or click the button to send
      </p>
    </div>
  );
}
