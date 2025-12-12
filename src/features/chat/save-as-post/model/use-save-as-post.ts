import { useState } from "react";

interface SaveAsPostParams {
  postId?: string;          // لو موجود → نعمل update
  prompt?: string;
  content: string;
  platform?: string;
  status?: "draft" | "scheduled";
  scheduledAt?: string | null;
}

export function useSaveAsPost() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAsPost = async ({
    postId,
    prompt,
    content,
    platform = "twitter",
    status = "draft",
    scheduledAt = null,
  }: SaveAsPostParams) => {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(
        postId ? `/api/posts/${postId}/update` : "/api/posts/from-chat",
        {
          method: postId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, content, platform, status, scheduledAt }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save post");
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error("Error saving post:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveAsPost, isSaving, error };
}
