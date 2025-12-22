"use client";

import { Button } from "@/shared/components/ui/button";
import { PostsTabs } from "../PostsTabs";
import { useSearchParams } from "next/navigation";
import { usePostsStore } from "@/entities/posts";

export default function PostsPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "all";

  //  Zustand store
  const {error} = usePostsStore();

  return (
    <div className="space-y-6">


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
