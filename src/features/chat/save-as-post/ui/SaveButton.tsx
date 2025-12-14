"use client";

import { useState } from "react";
import type { Message } from "@/entities/chat";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";
import { useSaveAsPost } from "../model/use-save-as-post";

interface SaveButtonProps {
  message: Message;
  prompt?: string;
  buttonText?: string;
  onSaved?: () => void;
}

export default function SaveButton({
  message,
  prompt,
  buttonText,
}: SaveButtonProps) {
  const { saveAsPost, isSaving } = useSaveAsPost();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (
    scheduledDate?: Date,
    platform?: string,
    contentOverride?: string
  ) => {
    try {
      await saveAsPost({
        prompt,
        content: contentOverride || message.content,
        platform: platform || "twitter", // ← يستقبل المنصة من المودال
        status: scheduledDate ? "scheduled" : "draft",
        scheduledAt: scheduledDate ? scheduledDate.toISOString() : null,
      });
      onSaved?.();

      alert(
        scheduledDate
          ? `✅ تم جدولة المنشور على ${platform} بتاريخ ${scheduledDate.toLocaleString()}`
          : "✅ تم حفظ المنشور بنجاح!"
      );
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isSaving}
        className="mt-2 text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {isSaving ? "جاري الحفظ..." : buttonText || "💾 save post"}
      </button>

      {isModalOpen && (
        <ScheduleModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialContent={message.content}
          onConfirm={(date, platform, content) => {
            handleSave(date, platform, content); // ← هنا بستقبل المنصة
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
function onSaved() {
  throw new Error("Function not implemented.");
}

