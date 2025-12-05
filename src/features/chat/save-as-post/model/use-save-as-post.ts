import { useState } from "react";

interface SaveAsPostParams {
    prompt?: string;
    content: string;
    platform?: string;
    status?: string;
}

export function useSaveAsPost() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveAsPost = async ({
        prompt,
        content,
        platform = "twitter",
        status = "draft",
        scheduledAt,
    }: SaveAsPostParams) => {
        setIsSaving(true);
        setError(null);

        try {
            const res = await fetch("/api/posts/from-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, content, platform, status, scheduledAt }),
            });
         
            console.log(res);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save post");
            }

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
