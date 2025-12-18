"use client";

import { Button } from "@/shared/components/ui/button";
import { PostsTabs } from "../PostsTabs";
import { useSearchParams } from "next/navigation";
import { usePostsStore } from "@/entities/posts";

export default function PostsPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "all";

  // ✅ Get state from Zustand store
  const hasFacebook = usePostsStore((state) => state.hasFacebook);
  const error = usePostsStore((state) => state.error);

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

      {/* PostsTabs now uses Zustand store directly */}
      <PostsTabs defaultTab={tabFromUrl} />
    </div>
  );
}
