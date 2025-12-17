"use client";

import * as React from "react";
import type { Post } from "@/entities/user/type/Post";
import { PostsProvider } from "@/app/_providers/PostContext";
import { PostsUIProvider } from "@/app/_providers/PostsUIContext";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function PostsProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [publishingId, setPublishingId] = React.useState<string | null>(null);
  const [hasFacebook, setHasFacebook] = React.useState(false);

  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);
  const [scheduleInitialContent, setScheduleInitialContent] =
    React.useState("");

  const fetchPosts = React.useCallback(async () => {
    const res = await fetch("/api/posts", { cache: "no-store" });
    const data = await safeJson(res);

    const list = data?.posts ?? data ?? [];
    setPosts(Array.isArray(list) ? list : []);
  }, []);

  const openScheduleModal = React.useCallback((post: Post) => {
    setScheduleInitialContent(post?.content ?? (post as any)?.prompt ?? "");
    setIsScheduleOpen(true);
  }, []);

  const deletePost = React.useCallback(
    async (postId: string) => {
      await fetch(`/api/posts/${postId}/delete-post`, { method: "DELETE" });
      await fetchPosts();
    },
    [fetchPosts]
  );

  const cancelSchedule = React.useCallback(
    async (postId: string) => {
      await fetch(`/api/posts/${postId}/cancel-schedule`, { method: "POST" });
      await fetchPosts();
    },
    [fetchPosts]
  );

  const publishToFacebook = React.useCallback(
    async (postId: string) => {
      try {
        setPublishingId(postId);
        const res = await fetch("/api/facebook/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });
        const data = await safeJson(res);
        if (!res.ok || data?.success === false)
          throw new Error(data?.error || "Publish failed");
        await fetchPosts();
      } finally {
        setPublishingId(null);
      }
    },
    [fetchPosts]
  );

  const uiValue = React.useMemo(
    () => ({
      hasFacebook,
      publishingId,
      onPublish: publishToFacebook,
      onCancelSchedule: cancelSchedule,
      onDelete: deletePost,
      refreshPosts: fetchPosts,
      onSchedule: openScheduleModal,
    }),
    [
      hasFacebook,
      publishingId,
      publishToFacebook,
      cancelSchedule,
      deletePost,
      fetchPosts,
      openScheduleModal,
    ]
  );

  // أول تحميل
  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <PostsProvider value={{ posts, setPosts }}>
      <PostsUIProvider value={uiValue}>
        {children}

        {isScheduleOpen && (
          <ScheduleModal
            open={isScheduleOpen}
            onOpenChange={setIsScheduleOpen}
            initialContent={scheduleInitialContent}
            onConfirm={async () => {
              setIsScheduleOpen(false);
              await fetchPosts();
            }}
          />
        )}
      </PostsUIProvider>
    </PostsProvider>
  );
}
