"use client";

import React from "react";
import type { Post } from "@/entities/user/type/Post";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import SaveButton from "@/features/chat/save-as-post/ui/SaveButton";
import { cn } from "@/shared/libs/chadcn/utils";
import { usePostsStore } from "@/entities/posts";
import { toast } from "sonner";

type Props = {
  posts: Post[];
  emptyText?: string;
};

export function RecentPostsTable({ posts, emptyText = "No posts." }: Props) {


  const {hasFacebook , publishingId , deletingId , updatePost , deletePost ,
     publishToFacebook , cancelSchedule , openScheduleModal , 
     fetchPosts} = usePostsStore()

  const handlePublishClick = async (postId: string) => {
    try {
      toast.loading("Publishing...", { id: `publish-${postId}` });
      await publishToFacebook(postId);
      toast.success("Published successfully ✅", { id: `publish-${postId}` });

      // Update local state optimistically
      updatePost(postId, {
        status: "published" as any,
        scheduled_at: null as any,
      });
    } catch (err: any) {
      toast.error(err?.message || "Publish failed", { id: `publish-${postId}` });
    }
  };

  const handleDeleteClick = async (postId: string) => {
    try {
      toast.loading("Deleting...", { id: `delete-${postId}` });
      await deletePost(postId);
      toast.success("Deleted successfully ✅", { id: `delete-${postId}` });
    } catch (err: any) {
      toast.error(err?.message || "Delete failed", { id: `delete-${postId}` });
    }
  };

  const handleCancelClick = async (postId: string) => {
    try {
      toast.loading("Canceling schedule...", { id: `cancel-${postId}` });
      await cancelSchedule(postId);
      toast.success("Schedule cancelled ✅", { id: `cancel-${postId}` });

      // Update local state optimistically
      updatePost(postId, {
        status: "draft" as any,
        scheduled_at: null as any,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel schedule", { id: `cancel-${postId}` });
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
              const isDeleting = deletingId === post.id;

              const showSchedule = isDraft;
              const showDelete = isDraft;
              const showCancel = isScheduled;
              const showPublish = !isPublished && !!hasFacebook;

              // ✅ يدعم created_at أو createdAt
              const created =
                (post as any).created_at ?? (post as any).createdAt ?? null;

              return (
                <tr key={post.id} className="border-b last:border-0">
                  <td className="p-3 max-w-[600px] line-clamp-2">
                    {(post as any).content}
                  </td>

                  <td className="p-3 text-xs text-muted-foreground">
                    {(post as any).scheduled_at
                      ? formatDate((post as any).scheduled_at)
                      : formatDate(created)}
                  </td>

                  <td className="p-3 capitalize">{s}</td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {showSchedule && (
                        <SaveButton
                          message={{
                            id: post.id,
                            content: (post as any).content,
                            role: "user" as any,
                            createdAt: "",
                          }}
                          postId={post.id}
                          prompt={(post as any).prompt}
                          buttonText="Schedule"
                          onSaved={async () => {
                            // ✅ Refresh posts
                            await fetchPosts();
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
                          disabled={isPublishing || isDeleting}
                        >
                          Cancel
                        </Button>
                      )}

                      {showPublish && (
                        <Button
                          size="sm"
                          disabled={isPublishing || isDeleting}
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
                          disabled={isDeleting || isPublishing}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
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
