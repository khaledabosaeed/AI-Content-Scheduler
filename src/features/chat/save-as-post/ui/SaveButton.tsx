
"use client";

import { useState, forwardRef } from "react";
import type { Message } from "@/entities/chat";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";
import { useState } from "react";
import { useSaveAsPost } from "../model/use-save-as-post";
import { toast } from "sonner";
import { Message } from "@/entities/chat";

interface SaveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message: Message;
  postId?: string; // ← لو موجود، سيعدل بدل إنشاء نسخة جديدة
  prompt?: string;
  buttonText?: string;
  onSaved?: () => void;
}

export default function SaveButton({
  message,
  postId,
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
        postId,
        prompt,
        content: contentOverride || message.content,
        platform: platform || "twitter",
        status: scheduledDate ? "scheduled" : "draft",
        scheduledAt: scheduledDate ? scheduledDate.toISOString() : null,
      });

      toast.success(
        scheduledDate
          ? `Your post is scheduled on ${platform} for ${scheduledDate.toLocaleString()}`
          : "Your post has been saved successfully."
      );
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
    }
  };
const SaveButton = forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ message, prompt, buttonText, onSaved, className, type, ...rest }, ref) => {
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
          type={type ?? "button"} // مهم عشان ما يعملش submit بالخطأ
          className={className} // خلي الشادكن يمرر الستايل هنا
          onClick={() => setIsModalOpen(true)}
          disabled={isSaving}
          {...rest}
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
