"use client";
import { useState } from "react";
import { Copy, RotateCw, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/entities/chat";
import { useSendMessage } from "@/features/chat/start-chat/model/use-send-message";

interface MessageActionsProps {
    messageId: string;
    content: string;
    isAI: boolean;
    prompt?: string;
}

/**
 * Message Actions - Action buttons for chat messages
 * Copy for all messages, Regenerate for AI messages, Delete for user messages
 */

export default function MessageActions({ messageId, content, isAI, prompt }: MessageActionsProps) {
    const [copied, setCopied] = useState(false);
    const { sendMessage } = useSendMessage();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleRegenerate = () => {
        if (prompt && !useChatStore.getState().isSending) {
            sendMessage(prompt);
        }
    };

    return (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Copy Button - Available for all messages */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 w-7 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Copy message"
            >
                {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                )}
            </Button>

            {/* Regenerate Button - Only for AI messages */}
            {isAI && prompt && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={useChatStore.getState().isSending}
                    className="h-7 w-7 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                    title="Regenerate response"
                >
                    <RotateCw className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                </Button>
            )}
        </div>
    );
}
