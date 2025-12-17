"use client";

import * as React from "react";
import type { Message } from "@/entities/chat";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";
import { useSaveAsPost } from "../model/use-save-as-post";
import { toast } from "sonner";

interface SaveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message: Message;
  postId?: string;
  prompt?: string;
  buttonText?: string;
  onSaved: () => void;
}

const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ message, prompt, buttonText, onSaved, className, type,postId, ...rest }, ref) => {
    const { saveAsPost, isSaving } = useSaveAsPost();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

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

        onSaved();

       toast.success(
        scheduledDate
          ? `Your post is scheduled on ${platform} for ${scheduledDate.toLocaleString()}`
          : "Your post has been saved successfully."
      );
      } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
      }
    };
    return (
      <>
        <button
          ref={ref}
          type={type ?? "button"}
          className={
            className ??
            "mt-2 text-xs bg-black text-white px-3 py-1 rounded hover:bg-action-hover disabled:opacity-50 transition-colors"
          }
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
            handleSave(date ?? undefined, platform, content);
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
