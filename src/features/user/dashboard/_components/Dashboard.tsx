"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/entities/user/type/Post";

import { StatsCards } from "./StatsCards";
import { PostsTabs } from "./PostsTabs";
import { UpcomingQueue } from "./UpcomingQueue";
import { AlertsPanel } from "./AlertsPanel";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { toast } from "sonner";
import { PostsUIProvider } from "@/app/_providers/PostsUIContext";
import { usePostsContext } from "@/app/_providers/PostContext";
import React from "react";

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const { posts, setPosts } = usePostsContext();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [hasFacebook, setHasFacebook] = React.useState<boolean | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/facebook/me");
      if (!res.ok) return;
      const data = await safeJson(res);
      setHasFacebook(!!data?.hasFacebook);
    } catch (err) {
      console.error("fetchUser error:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/posts");
      const data = await safeJson(res);

      if (!res.ok) throw new Error(data?.error || "Failed to load posts");
      setPosts((data?.posts || []) as Post[]);
    } catch (err: any) {
      console.error(err);
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
      toast.loading("Publishing...", { id: `publish-${postId}` });

      const res = await fetch("/api/facebook/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await safeJson(res);

      if (!res.ok || data?.success === false) {
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
      if (!res.ok) throw new Error(data?.error || "Failed to cancel schedule");

      toast.success("Schedule cancelled ✅", { id: `cancel-${postId}` });
      await fetchPosts();
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel schedule", {
        id: `cancel-${postId}`,
      });
    }
  };
  const handleScheduleClick = ()=>{
    fetchPosts()
  }

  const deletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/delete-post`, {
        method: "DELETE",
      });

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.error || "Failed to delete post");

      toast.success("Deleted successfully ✅", { id: `delete-${postId}` });
      await fetchPosts();
    } catch (err: any) {
      toast.error("❌ " + (err?.message || "Failed to delete post"));
    }
  };

  const normalizedPosts = useMemo(() => {
    return (posts as any[]).map((p) => ({
      ...p,
      created_at: p.created_at ?? p.createdAt ?? null,
      scheduled_at: p.scheduled_at ?? p.scheduledAt ?? null,
    }));
  }, [posts]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-[420px] rounded-xl" />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-[220px] rounded-xl" />
            <Skeleton className="h-[260px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <StatsCards posts={normalizedPosts as any} />


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <PostsUIProvider
            value={{
              hasFacebook,
              publishingId,
              onPublish: publishToFacebook,
              onCancelSchedule: cancelSchedule,
              onDelete: deletePost,
              refreshPosts: fetchPosts,
            }}
          >
            <PostsTabs />
          </PostsUIProvider>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <UpcomingQueue posts={normalizedPosts as any} />
          <AlertsPanel posts={normalizedPosts as any} />
        </div>
      </div>
    </div>
  );
}
