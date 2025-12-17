"use client";

import type { Post } from "@/entities/user/type/Post";
import { Button } from "@/shared/components/ui/button";

import { buttonVariants } from "@/shared/components/ui/button";
import SaveButton from "@/features/chat/save-as-post/ui/SaveButton";
import { cn } from "@/shared/libs/chadcn/utils";
import { usePostsUI } from "@/app/_providers/PostsUIContext";
import { usePostsContext } from "@/app/_providers/PostContext";

type Props = {
  posts: Post[];
  emptyText?: string;
};

export function RecentPostsTable({ posts, emptyText = "No posts." }: Props) {
  const { setPosts } = usePostsContext();
  const {
    hasFacebook,
    publishingId,
    onPublish,
    onCancelSchedule,
    onDelete,
    onSchedule,
    refreshPosts,
  } = usePostsUI();

  const updateLocal = (postId: string, patch: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? ({ ...p, ...patch } as Post) : p))
    );
  };

  const handlePublishClick = async (postId: string) => {
    try {
      if (!onPublish) return;

      await onPublish(postId);

      updateLocal(postId, {
        status: "published" as any,
        scheduled_at: null as any,
      } as any);
    } catch (err: any) {
      alert("❌ Faild Publish " + (err?.message || "Unexpected error"));
    }
  };

  const handleDeleteClick = async (postId: string) => {
    // optimistic
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    await onDelete(postId);
  };

  const handleCancelClick = async (postId: string) => {
    try {
      if (!onCancelSchedule) return;

      await onCancelSchedule(postId);

      updateLocal(postId, {
        status: "draft" as any,
        scheduled_at: null as any,
      } as any);
    } catch (err: any) {
      alert("❌ Faild  " + (err?.message || "Unexpected error"));
    }
  };
  const formatDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
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
              <th className="p-3">Date</th>
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
              const isPublishing = publishingId === post.id;

              const showSchedule = isDraft;
              const showDelete = isDraft;
              const showCancel =
                isScheduled && typeof onCancelSchedule === "function";
              const showPublish =
                !isPublished && hasFacebook && typeof onPublish === "function";

              return (
                <tr key={post.id} className="border-b last:border-0">
                  <td className="p-3 max-w-[600px] line-clamp-2">
                    {post.content}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {post.scheduled_at
                      ? formatDate(post.scheduled_at)
                      : formatDate(post.created_at)}
                  </td>
                  <td className="p-3 capitalize">{s}</td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {showSchedule && (
                        <SaveButton
                          message={{
                            id: post.id,
                            content: post.content,
                            role: "user" as any,
                            createdAt: "",
                          }}
                          postId={post.id}
                          prompt={post.prompt}
                          buttonText="Schedule"
                          onSaved={async () => {
                            console.log("onSaved fired ✅");
                            await refreshPosts?.();
                            console.log("refreshPosts finished ✅");
                          }}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "h-9 px-3"
                          )}
                        />
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
                          disabled={isPublishing}
                          onClick={() => handlePublishClick(post.id)}
                        >
                          {isPublishing ? "Publishing..." : "Publish"}
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
