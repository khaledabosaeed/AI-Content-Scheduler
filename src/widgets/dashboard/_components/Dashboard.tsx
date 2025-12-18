"use client";

import { useMemo } from "react";
import { StatsCards } from "./StatsCards";
import { PostsTabs } from "./PostsTabs";
import { UpcomingQueue } from "./UpcomingQueue";
import { AlertsPanel } from "./AlertsPanel";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { usePostsStore } from "@/entities/posts";

export default function Dashboard() {
  // ✅ Get data from Zustand store
  const posts = usePostsStore((state) => state.posts);
  const isFetching = usePostsStore((state) => state.isFetching);
  const error = usePostsStore((state) => state.error);

  const normalizedPosts = useMemo(() => {
    return (posts as any[]).map((p) => ({
      ...p,
      created_at: p.created_at ?? p.createdAt ?? null,
      scheduled_at: p.scheduled_at ?? p.scheduledAt ?? null,
    }));
  }, [posts]);

  // ✅ Show loading skeleton only on first fetch (when no posts yet)
  if (isFetching && posts.length === 0) {
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
          <PostsTabs />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <UpcomingQueue posts={normalizedPosts as any} />
          <AlertsPanel posts={normalizedPosts as any} />
        </div>
      </div>
    </div>
  );
}
