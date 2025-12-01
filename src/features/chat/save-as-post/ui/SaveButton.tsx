"use client";
import { useSaveAsPost } from "../model/use-save-as-post";
import type { Message } from "@/entities/chat";

interface SaveButtonProps {
    message: Message;
    prompt?: string;
}

export default function SaveButton({ message, prompt }: SaveButtonProps) {
    const { saveAsPost, isSaving } = useSaveAsPost();

    const handleSave = async () => {
        try {
            await saveAsPost({
                prompt,
                content: message.content,
                platform: "twitter",
                status: "draft",
            });
            alert("✅ تم حفظ المنشور بنجاح!");
        } catch (err: any) {
            alert("❌ " + err.message);
        }
    };

    return (
        <button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-2 text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
            {isSaving ? "جاري الحفظ..." : "💾 save post"}
        </button>
    );
}
