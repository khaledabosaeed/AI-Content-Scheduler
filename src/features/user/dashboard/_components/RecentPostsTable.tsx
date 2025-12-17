"use client";

import type { Post } from "@/entities/user/type/Post";
import { SaveButton } from "@/features/chat";
import { Button } from "@/shared/components/ui/button";
type Props = {
  posts: Post[];
  emptyText?: string;

  onSchedule: (post: Post) => void;
  onPublish?: (postId: string) => Promise<void> | void;
  onCancelSchedule?: (postId: string) => Promise<void> | void;

  onDelete: (postId: string) => Promise<void> | void;
  publishingId?: string | null;

  setPosts?: React.Dispatch<React.SetStateAction<Post[]>>;
};

export function RecentPostsTable({
  posts,
  emptyText = "No posts.",
  onSchedule,
  onPublish,
  onCancelSchedule,
  onDelete,
  setPosts,
}: Props) {
  const updateLocal = (postId: string, patch: Partial<Post>) => {
    if (!setPosts) return;
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? ({ ...p, ...patch } as Post) : p))
    );
  };

  const handleScheduleClick = (post: Post) => {
    updateLocal(post.id, { status: "scheduled" as any });
    onSchedule?.(post);
  };

  const markAsScheduled = (postId: string) => {
  if (!setPosts) return;
  setPosts(prev =>
    prev.map(p => (p.id === postId ? { ...p, status: "scheduled" } : p))
  );
  // onSchedule?.(postId)
};



  const handlePublishClick = async (postId: string) => {
    try {
      if (!onPublish) return;
      console.log("✅ publish clicked", postId);
      await onPublish?.(postId);

      updateLocal(postId, {
        status: "published" as any,
        scheduled_at: null as any,
      } as any);

      console.log("تم النشر ");
    } catch (err: any) {
      alert("❌ فشل النشر: " + (err?.message || "Unexpected error"));
    }
  };

  const handleDeleteClick = async (postId: string) => {
    if (setPosts) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
    await onDelete(postId);
  };

  if (!posts?.length) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  console.log(typeof onSchedule)
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left text-muted-foreground">
              <th className="p-3">Content</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post) => {
              const s = (post.status || "draft").toLowerCase();
              const isDraft = s === "draft";
              const isScheduled = s === "scheduled";
              const isPublished = s === "published";

              const showSchedule = isDraft && typeof onSchedule === "function";
              const showDelete = isDraft;
              const showCancel =
                isScheduled && typeof onCancelSchedule === "function";
              const showPublish =
                !isPublished && typeof onPublish === "function";

              const handleCancelClick = async (postId: string) => {
                try {
                  if (!onCancelSchedule) return;

                  await onCancelSchedule(postId);

                  // ✅ تحديث UI بعد النجاح
                  updateLocal(postId, {
                    status: "draft" as any,
                    scheduled_at: null as any,
                  } as any);
                } catch (err: any) {
                  alert(
                    "❌ فشل الإلغاء: " + (err?.message || "Unexpected error")
                  );
                }
              };

              return (
                <tr key={post.id} className="border-b last:border-0">
                  <td className="p-3 max-w-[600px] line-clamp-2">
                    {post.content}
                  </td>
                  <td className="p-3 capitalize">{s}</td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {showSchedule && (
                        <Button asChild size="sm" variant="outline" >
                          <SaveButton
                            message={{
                              id: post.id,
                              content: post.content,
                              role: "user",
                              createdAt: "",
                            }}
                            prompt={post.prompt}
                            buttonText="Scheduale" // يظهر نص "جدولة"
                            postId={post.id}
                            onSaved={() => handleScheduleClick(post)}
                          />
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
                      {showDelete && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(post.id)}
                        >
                          Delete
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
