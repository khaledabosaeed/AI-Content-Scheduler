"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { Plus, MessageSquarePlus, Settings, LayoutGrid } from "lucide-react";
import { useChatStore } from "@/entities/chat";
import Link from "next/link";

export const ChatSideBar = () => {
  const {
    clearMessages,
    isSending,
    createNewSession,
    chatHistory,
    loadSession,
    currentSessionId,
    isLoadingHistory,
    fetchChatHistory,
  } = useChatStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchChatHistory();
  }, []);
  const handleNewChat = () => {
    clearMessages();
    createNewSession();
  };

  const handleLoadSession = (sessionId: string) => {
    if (sessionId !== currentSessionId) {
      loadSession(sessionId);
    }
  };
  const orderedChats = [...chatHistory].sort((a, b) => {
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

    return bTime - aTime;
  });
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-card to-popover text-text-primary flex flex-col border-r border-divider">
      {/* Header */}
      <Link href="/" className="w-full p-5">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-text-secondary hover:text-primary hover:bg-action-hover rounded-lg transition-all"
        >
          <LayoutGrid className="w-4 h-4" />
          Home
        </Button>
      </Link>

      <Separator className="bg-divider" />

      {/* Chat History */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <p className="text-xs font-semibold text-text-disabled uppercase mb-4 ml-2">
            Recent Chats
          </p>

          {isLoadingHistory ? (
            <p className="text-xs text-text-secondary text-center py-8">
              Loading chats...
            </p>
          ) : chatHistory.length === 0 ? (
            <p className="text-xs text-text-secondary text-center py-8">
              No chat history yet
            </p>
          ) : (
            orderedChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleLoadSession(chat.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-action-hover transition-all text-sm truncate flex items-center gap-2 group ${
                  chat.id === currentSessionId
                    ? "bg-action-selected text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <MessageSquarePlus className="w-4 h-4 flex-shrink-0 group-hover:text-primary transition-colors" />
                <span className="truncate">{chat.title || "New Chat"}</span>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      <Separator className="bg-divider" />

      {/* Footer */}
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-text-secondary hover:text-primary hover:bg-action-hover rounded-lg transition-all"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
        <Link href="/dashboard" className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-text-secondary hover:text-primary hover:bg-action-hover rounded-lg transition-all"
          >
            <LayoutGrid className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>
      </div>

      <div className="p-4 space-y-3">
        <Button
          onClick={handleNewChat}
          disabled={isSending}
          className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:from-accent-foreground hover:to-primary text-primary-foreground shadow-lg rounded-lg font-medium transition-all"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </Button>
      </div>
      <Separator className="bg-divider" />
    </div>
  );
};
