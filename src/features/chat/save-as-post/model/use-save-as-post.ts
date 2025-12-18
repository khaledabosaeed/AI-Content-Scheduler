import { api } from "@/shared/api/api-client";
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
      const payload = { prompt, content, platform, status, scheduledAt };

      const res = postId
        ? await api.put(`posts/${postId}/update`, payload)
        : await api.post("posts/from-chat", payload);
      return res;
    }
     catch (err: any) {
      setError(err.message);
      console.error("Error saving post:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveAsPost, isSaving, error };
}
