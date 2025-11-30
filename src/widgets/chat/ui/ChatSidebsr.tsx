"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, MessageSquarePlus, Settings, LayoutGrid } from "lucide-react";
import { useChatStore } from "@/entities/chat";
import Link from "next/link";

export const ChatSideBar = () => {
    const { clearMessages, isSending } = useChatStore();

    const chatHistory = [
        { id: 1, title: "Content Ideas" },
        { id: 2, title: "Writing Tips" },
        { id: 3, title: "Post Suggestions" },
    ];

    const handleNewChat = () => {
        if (confirm("Are you sure you want to start a new chat? (Saved posts will not be deleted)")) {
            clearMessages();
        }
    };

    return (
        <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-950 dark:from-slate-950 dark:to-slate-950 text-white flex flex-col border-r border-gray-800 dark:border-gray-800">
            {/* Header */}
            <div className="p-4 space-y-3">
                <Button
                    onClick={handleNewChat}
                    disabled={isSending}
                    className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg rounded-lg font-medium"
                >
                    <Plus className="w-5 h-5" />
                    New Chat
                </Button>
            </div>

            <Separator className="bg-gray-800" />

            {/* Chat History */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-4 ml-2">Recent Chats</p>
                    {chatHistory.map((chat) => (
                        <button
                            key={chat.id}
                            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-800/50 transition-colors text-sm text-gray-400 hover:text-gray-100 truncate flex items-center gap-2 group"
                        >
                            <MessageSquarePlus className="w-4 h-4 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                            <span className="truncate">{chat.title}</span>
                        </button>
                    ))}
                </div>
            </ScrollArea>

            <Separator className="bg-gray-800" />

            {/* Footer */}
            <div className="p-4 space-y-2">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg"
                >
                    <Settings className="w-4 h-4" />
                    Settings
                </Button>
                <Link href="/dashboard" className="w-full">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}