"use client";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/entities/chat";
import { useSendMessage } from "../model/use-send-message";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
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
    <div className="border-t border-divider bg-card shadow-lg">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-3 md:py-4 space-y-2">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <p className="text-destructive text-xs md:text-sm flex-1">
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
            className="resize-none pr-12 md:pr-14 rounded-xl border-border bg-background text-text-primary placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px] text-sm md:text-base"
          />
          {isSending ? (
            <Button
              onClick={cancelOngoingRequest}
              disabled={!isSending}
              size="sm"
              className="absolute bottom-2 right-2 bg-gradient-to-r from-primary to-accent hover:from-accent-foreground hover:to-primary text-primary-foreground rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 md:h-9 md:w-9 p-0"
              title="Cancel Ongoing Request"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          ) :

            <Button
              onClick={handleSend}
              disabled={isSending || !text.trim()}
              size="sm"
              className="absolute bottom-2 right-2 bg-gradient-to-r from-primary to-accent hover:from-accent-foreground hover:to-primary text-primary-foreground rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 md:h-9 md:w-9 p-0"
              title="Send (Ctrl + Enter)"
            >
              <SendIcon className="w-4 h-4" />
            </Button>
          }
        </div>

        <p className="text-[10px] md:text-xs text-text-secondary text-center font-light">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-text-secondary font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-text-secondary font-mono text-[10px]">Enter</kbd> to send
        </p>


      </div>
    </div>
  );
}
