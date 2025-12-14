"use client";

import { useState, forwardRef } from "react";
import type { Message } from "@/entities/chat";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";
import { useSaveAsPost } from "../model/use-save-as-post";

interface SaveButtonProps {
  message: Message;
  prompt?: string;
  buttonText?: string;
  onSaved?: () => void;
}

const SaveButton = forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ message, prompt, buttonText, onSaved }, ref) => {
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
          platform: platform || "twitter",
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
          ref={ref}
          onClick={() => setIsModalOpen(true)}
          disabled={isSaving}
        >
          {isSaving ? "جاري الحفظ..." : buttonText || "💾 save post"}
        </button>

        {isModalOpen && (
          <ScheduleModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            initialContent={message.content}
            onConfirm={(date, platform, content) => {
              handleSave(date, platform, content);
              setIsModalOpen(false);
            }}
          />
        )}
      </>
    );
  }
);

SaveButton.displayName = "SaveButton";

export default SaveButton;
