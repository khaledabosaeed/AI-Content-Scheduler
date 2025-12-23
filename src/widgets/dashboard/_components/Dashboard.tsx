"use client";

import { useMemo } from "react";
import { StatsCards } from "./StatsCards";
import { PostsTabs } from "./PostsTabs";
import { UpcomingQueue } from "./UpcomingQueue";
import { AlertsPanel } from "./AlertsPanel";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { usePostsStore } from "@/entities/posts";
import { Button } from "@/shared/components/ui/button";
import { PostsLoader } from "@/features/posts";

export default function Dashboard() {
  //  Zustand store
  const {posts , hasFacebook, isFetching , error} = usePostsStore();

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
    <PostsLoader>
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border p-3 text-sm text-destructive">
          {error}
        </div>
      )}

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
    </PostsLoader>
  );
}
