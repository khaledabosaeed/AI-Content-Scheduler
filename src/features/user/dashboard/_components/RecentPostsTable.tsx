"use client";

import type { Post } from "@/entities/user/type/Post";
import { Button } from "@/shared/components/ui/button";

type Props = {
  posts: Post[];
  emptyText?: string;

  // ✅ optional handlers
  onSchedule?: (post: Post) => void;
  onPublish?: (postId: string) => Promise<void> | void;
  onCancelSchedule?: (postId: string) => Promise<void> | void;

  // ✅ optional optimistic updater
  setPosts?: React.Dispatch<React.SetStateAction<Post[]>>;
};

export function RecentPostsTable({
  posts,
  emptyText = "No posts.",
  onSchedule,
  onPublish,
  onCancelSchedule,
  setPosts,
}: Props) {
  const updateLocal = (postId: string, patch: Partial<Post>) => {
    if (!setPosts) return; // مش إجباري
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? ({ ...p, ...patch } as Post) : p))
    );
  };

  const handleScheduleClick = (post: Post) => {
    // ✅ optimistic: نحط status scheduled (حقيقيًا التاريخ بيتحدد من المودال عندك)
    updateLocal(post.id, { status: "scheduled" as any });
    onSchedule?.(post);
  };

  const handlePublishClick = async (postId: string) => {
    // ✅ optimistic: published
    updateLocal(postId, {
      status: "published" as any,
      scheduled_at: null as any,
    } as any);
    await onPublish?.(postId);
  };

  const handleCancelClick = async (postId: string) => {
    // ✅ optimistic: draft + cancel date
    updateLocal(postId, {
      status: "draft" as any,
      scheduled_at: null as any,
    } as any);
    await onCancelSchedule?.(postId);
  };

  if (!posts?.length) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left text-muted-foreground">
              <th className="p-3">Content</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post) => {
              const s = (post.status || "draft").toString().toLowerCase();
              const isDraft = s === "draft";
              const isScheduled = s === "scheduled";
              const isPublished = s === "published";

              const showSchedule = isDraft && typeof onSchedule === "function";
              const showPublish =
                !isPublished && typeof onPublish === "function";
              const showCancel =
                isScheduled && typeof onCancelSchedule === "function";

              return (
                <tr key={post.id} className="border-b last:border-0">
                  <td className="p-3 max-w-[600px] line-clamp-2">
                    {post.content}
                  </td>
                  <td className="p-3 capitalize">{s}</td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {showSchedule && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleScheduleClick(post)}
                        >
                          Schedule
                        </Button>
                      )}

                      {showCancel && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelClick(post.id)}
                        >
                          Cancel
                        </Button>
                      )}

                      {showPublish && (
                        <Button
                          size="sm"
                          onClick={() => handlePublishClick(post.id)}
                        >
                          Publish
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
