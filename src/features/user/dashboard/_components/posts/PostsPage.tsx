"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/entities/user/type/Post";
import Link from "next/link";
import { usePostsContext } from "@/app/_providers/PostContext";
import { PostsUIProvider } from "@/app/_providers/PostsUIContext";
import { Button } from "@/shared/components/ui/button";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";
import { PostsTabs } from "../PostsTabs";

import { toast } from "sonner";

const safeJson = async (res: Response) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
};

export default function PostsPage() {
  const { posts, setPosts } = usePostsContext();
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hasFacebook, setHasFacebook] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/facebook/me");
      if (!res.ok) return;
      const data = await safeJson(res);
      setHasFacebook(!!data.hasFacebook);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/posts");
      const data = await safeJson(res);

      if (!res.ok)
        throw new Error(data?.error || data?.raw || "Failed to load posts");

      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch (err: any) {
      const msg = err?.message || "Unexpected error";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  const publishToFacebook = async (postId: string) => {
    try {
      setPublishingId(postId);
      toast.loading("Publishing to Facebook...", { id: `publish-${postId}` });

      const res = await fetch("/api/facebook/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(
          data?.error?.message || data?.error || "Publish failed"
        );
      }

      toast.success("Published successfully ✅", { id: `publish-${postId}` });
      await fetchPosts();
    } catch (err: any) {
      toast.error(err?.message || "Publish failed", {
        id: `publish-${postId}`,
      });
      throw err;
    } finally {
      setPublishingId(null);
    }
  };

  const cancelSchedule = async (postId: string) => {
    try {
      toast.loading("Canceling schedule...", { id: `cancel-${postId}` });

      const res = await fetch(`/api/posts/${postId}/cancel-schedule`, {
        method: "POST",
      });
      const data = await safeJson(res);

      if (!res.ok)
        throw new Error(
          data?.error || data?.raw || "Failed to cancel schedule"
        );

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? ({
                ...p,
                status: "draft" as any,
                scheduled_at: null as any,
              } as any)
            : p
        )
      );

      toast.success("Schedule canceled ", { id: `cancel-${postId}` });
      await fetchPosts();
    } catch (err: any) {
      alert("❌ " + (err?.message || "فشل إلغاء الجدولة"));
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/delete-post`, {
        method: "DELETE",
      });
      const data = await safeJson(res);

      if (!res.ok) throw new Error(data?.error || "Delete failed");

      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete post");
    }
  };

  // ===== Open schedule modal =====
  const openScheduleModal = (post: Post) => {
    setSelectedPost(post);
    setIsScheduleOpen(true);
  };

  const confirmSchedule = async (
    date: Date,
    platform: string,
    content: string
  ) => {
    if (!selectedPost?.id) return;

    const id = selectedPost.id;

    try {
      setIsScheduling(true);
      toast.loading("Scheduling post...");

      const res = await fetch(`/api/posts/${selectedPost.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledAt: date.toISOString(),
          platform,
          content,
          status: "scheduled",
        }),
      });

      const data = await safeJson(res);

      if (!res.ok)
        throw new Error(data?.error || data?.raw || "Failed to schedule post");

      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? ({
                ...p,
                status: "scheduled" as any,
                platform: platform as any,
                content: content as any,
                scheduled_at: date.toISOString() as any,
              } as any)
            : p
        )
      );
      setIsScheduleOpen(false);
      setSelectedPost(null);

      toast.success("Scheduled successfully ");
      await fetchPosts();
    } catch (err: any) {
      toast.error(err?.message || "Schedule failed");
    } finally {
      setIsScheduling(false);
    }
  };

  const uiValue = useMemo(
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
      fetchPosts,
      publishToFacebook,
      cancelSchedule,
      deletePost,
      openScheduleModal,
    ]
  );

  console.log("refreshPosts type:", typeof uiValue.refreshPosts);
  return (
    <div className="space-y-6">
      {!hasFacebook && (
        <div className="rounded-md border bg-card p-3 text-sm flex justify-between">
          <span className="text-muted-foreground">
            Your Facebook account is not connected.
          </span>
          <Button asChild variant="outline">
            <a href="/api/oauth/facebook/login">Connect</a>
          </Button>
        </div>
      )}

      {error && (
        <div className="rounded-md border p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* <PostsTabs
        posts={posts}
        hasFacebook={hasFacebook}
        setPosts={setPosts}
        onSchedule={(post) => openScheduleModal(post)}
        onPublish={(id) => publishToFacebook(id)}
        onCancelSchedule={(postId) => cancelSchedule(postId)}
        onRefresh={fetchPosts}
        onDelete={(postId) => deletePost(postId)}
      /> */}

      <PostsUIProvider value={uiValue}>
        <PostsTabs />
      </PostsUIProvider>

      {isScheduleOpen && selectedPost && (
        <ScheduleModal
          open={isScheduleOpen}
          onOpenChange={(v) => {
            setIsScheduleOpen(v);
            if (!v) setSelectedPost(null);
          }}
          initialContent={selectedPost.content || ""}
          onConfirm={(date, platform, content) => {
            if (!date) return; // أو alert للمستخدم
            confirmSchedule(date, platform, content);
          }}
        />
      )}
    </div>
  );
}
