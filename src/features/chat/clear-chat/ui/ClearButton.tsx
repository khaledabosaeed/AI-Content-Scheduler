"use client";
import { useChatStore } from "@/entities/chat";

export default function ClearButton() {
    const { clearMessages, isSending } = useChatStore();

    const handleClear = () => {
        if (
            confirm(
                "هل أنت متأكد من حذف المحادثة؟ (لن يتم حذف المنشورات المحفوظة)"
            )
        ) {
            clearMessages();
        }
    };

    return (
        <button
            onClick={handleClear}
            disabled={isSending}
            className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
            🗑️ مسح
        </button>
    );
}
