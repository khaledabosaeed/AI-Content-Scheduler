"use client";

import * as React from "react";
import type { Post } from "@/entities/user/type/Post";
import { PostsProvider } from "@/app/_providers/PostContext";
import { PostsUIProvider } from "@/app/_providers/PostsUIContext";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";
import { api } from "@/shared/api/api-client";
import { useCallback, useEffect, useMemo, useState } from "react";




export default function PostsProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [hasFacebook, setHasFacebook] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    const v = window.localStorage.getItem("hasFacebook");
    return v === null ? null : v === "1";
  });

  const fetchFacebookStatus = useCallback(async () => {
    try {
      const res = await api.post("facebook/me");
      const ok = !!res?.hasFacebook;
      setHasFacebook(ok);
      window.localStorage.setItem("hasFacebook", ok ? "1" : "0");
    } catch {
      setHasFacebook(false);
      window.localStorage.setItem("hasFacebook", "0");
    }
  }, []);

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleInitialContent, setScheduleInitialContent] =
    React.useState("");

  const fetchPosts = useCallback(async () => {
    const res = await api.get("posts", { cache: "no-store" });

    const list = res?.posts ?? res ?? [];
    setPosts(Array.isArray(list) ? list : []);
  }, []);

  const openScheduleModal = useCallback((post: Post) => {
    setScheduleInitialContent(post?.content ?? (post as any)?.prompt ?? "");
    setIsScheduleOpen(true);
  }, []);

  const deletePost =  useCallback(
    async (postId: string) => {
      const prev = posts; // snapshot للـ rollback

      try {
        setDeletingId(postId);

        // ✅ optimistic remove
        setPosts((p) => p.filter((x) => x.id !== postId));

         await api.delete(`posts/${postId}/delete-post`);

        

      } catch (err: any) {
        // ✅ rollback
        setPosts(prev);
        // toast.error("❌ " + (err?.message || "Delete failed"));
        throw err;
      } finally {
        setDeletingId(null);
      }
    },
    [posts]
  );

  const cancelSchedule = React.useCallback(
    async (postId: string) => {
      await api.post(`posts/${postId}/cancel-schedule`, { method: "POST" });
      await fetchPosts();
    },
    [fetchPosts]
  );

  useEffect(() => {
    fetchFacebookStatus();
  }, [fetchFacebookStatus]);

  const publishToFacebook = useCallback(
    async (postId: string) => {
      try {
        setPublishingId(postId);
        await api.post("facebook/publish", {

           postId 
        });

        await fetchPosts();
      } finally {
        setPublishingId(null);
      }
    },
    [fetchPosts]
  );

  const uiValue = useMemo(
    () => ({
      hasFacebook: !!hasFacebook,
      publishingId,
      deletingId,
      onPublish: publishToFacebook,
      onCancelSchedule: cancelSchedule,
      onDelete: deletePost,
      refreshPosts: fetchPosts,
      onSchedule: openScheduleModal,
    }),
    [
      hasFacebook,
      publishingId,
      deletingId,
      publishToFacebook,
      cancelSchedule,
      deletePost,
      fetchPosts,
      openScheduleModal,
    ]
  );

  useEffect(() => {
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
