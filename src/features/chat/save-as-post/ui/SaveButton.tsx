import ScheduleModal from "@/widgets/scheduler/ScheduleModal";
import { useState } from "react";
import { useSaveAsPost } from "../model/use-save-as-post";
import { toast } from "sonner";
import { Message } from "@/entities/chat";

interface SaveButtonProps {
  message: Message;
  postId?: string; // ← لو موجود، سيعدل بدل إنشاء نسخة جديدة
  prompt?: string;
  buttonText?: string;
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
            handleSave(date ?? undefined, platform, content);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
