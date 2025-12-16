"use client";

import { useState } from "react";
import ChatInterface from "./ChatInterface";
import { ChatSideBar } from "./ChatSidebar";
import { Button } from "@/shared/components/ui/button";
import { Menu, X } from "lucide-react";

/**
 * Chat Widget - The complete chat interface with toggleable sidebar on right
 * This is a widget that composes the ChatInterface feature with ChatGPT-like layout
 */
export default function ChatWidget() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Main Chat Interface */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Toggle Button - Desktop only (top left) */}
                <div className="hidden md:block absolute top-4 left-4 z-20">
                    <Button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        variant="ghost"
                        size="sm"
                        className="text-text-secondary hover:bg-action-hover hover:text-text-primary transition-colors"
                        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Mobile Menu Button - top right */}
                <div className="md:hidden absolute top-3 right-3 z-50">
                    <Button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        variant="ghost"
                        size="sm"
                        className="text-text-secondary hover:bg-action-hover hover:text-text-primary transition-colors"
                        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>

                <ChatInterface />
            </div>

            {/* Sidebar - Right - Responsive
                - Mobile: Fixed, slides in/out, overlay visible
                - Desktop: Static, can toggle open/close with width animation
            */}
            <div
                className={`hidden md:flex h-screen bg-gradient-to-b from-card to-popover border-l border-divider transition-all duration-300 ease-in-out overflow-hidden ${
                    sidebarOpen ? "w-64" : "w-0"
                }`}
            >
                <ChatSideBar />
            </div>

            {/* Sidebar - Mobile */}
            <div
                className={`fixed right-0 top-0 h-screen w-64 md:hidden bg-gradient-to-b from-card to-popover border-l border-divider transition-transform duration-300 ease-in-out z-40 ${
                    sidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <ChatSideBar />
            </div>

            {/* Overlay - Mobile only */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
