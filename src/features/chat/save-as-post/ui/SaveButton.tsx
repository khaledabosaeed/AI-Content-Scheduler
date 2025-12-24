"use client";

import * as React from "react";
import type { Message } from "@/entities/chat";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";
import { useSaveAsPost } from "../model/use-save-as-post";
import { Post, usePostsStore } from "@/entities/posts";
import { toast } from "sonner";
import { useState } from "react";

interface SaveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message: Message;
  postId?: string;
  prompt?: string;
  post?:Post
  buttonText?: string;
  onSaved?: () => void;
}

const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  (
    { message, prompt, buttonText, onSaved, className, type, postId, post,...rest },
    ref
  ) => {
    const { saveAsPost, isSaving } = useSaveAsPost();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ Get fetchPosts from store
    const {fetchPosts} = usePostsStore();
    
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

        onSaved?.();

        // ✅ Refresh posts from store
        await fetchPosts();

    toast.success(
      scheduledDate
        ? `The post has been successfully scheduled on ${platform}.`
        : "The post has been saved successfully."
    );
      } catch (err: any) {
        toast.error("❌ " + (err?.message ?? `Failed to save post`));
      }
    };

    return (
      <>
        <button
          ref={ref}
          type={type ?? "button"}
          className={
            className ??
            "mt-2 text-xs bg-black text-white px-3 py-1 rounded disabled:opacity-50 transition-colors"
          }
          onClick={() => setIsModalOpen(true)}
          disabled={isSaving}
          {...rest}
        >
          {isSaving ? "save loading.." : buttonText || "💾 save post"}
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
            post={post}
          />
        )}
      </>
    );
  }
);

SaveButton.displayName = "SaveButton";
export default SaveButton;
