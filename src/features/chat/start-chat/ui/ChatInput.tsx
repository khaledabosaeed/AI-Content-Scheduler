"use client";
import { useState } from "react";
import { useChatStore } from "@/entities/chat";
import { useSendMessage } from "../model/use-send-message";

export default function ChatInput() {
  const [text, setText] = useState("");
  const { isSending, error } = useChatStore();
  const { sendMessage } = useSendMessage();

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        className="flex-1 border p-2 rounded"
        value={text}
        disabled={isSending}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
      />

      <button
        onClick={handleSend}
        disabled={isSending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>

      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
