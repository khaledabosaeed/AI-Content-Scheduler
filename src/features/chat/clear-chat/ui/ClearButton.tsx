"use client";
import { useChatStore } from "@/entities/chat";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function ClearButton() {
    const { clearMessages, isSending } = useChatStore();

    const handleClear = () => {
        if (
            confirm(
                "Are you sure you want to clear the conversation? (Saved posts will not be deleted)"
            )
        ) {
            clearMessages();
        }
    };

    return (
        <Button
            onClick={handleClear}
            disabled={isSending}
            variant="destructive"
            size="sm"
            className="gap-2"
        >
            <Trash2 className="w-4 h-4" />
            Clear
        </Button>
    );
}
