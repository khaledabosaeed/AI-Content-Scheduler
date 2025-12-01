"use client";

import { useState } from "react";
import ChatInterface from "./ChatInterface";
import { ChatSideBar } from "./ChatSidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

/**
 * Chat Widget - The complete chat interface with toggleable sidebar on right
 * This is a widget that composes the ChatInterface feature with ChatGPT-like layout
 */
export default function ChatWidget() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    console.log(sidebarOpen);
    

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
            {/* Main Chat Interface */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Toggle Button */}
                <div className="absolute top-4 right-4 z-20">
                    <Button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>

                <ChatInterface />
            </div>

            {/* Sidebar - Right - Responsive */}
            <div
                className={`fixed md:static right-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-950 dark:from-slate-950 dark:to-slate-950 border-l border-gray-800 dark:border-gray-800 transition-transform duration-300 ease-in-out z-40 ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
                    }`}
            >
                <ChatSideBar />
            </div>

            {/* Overlay - Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
