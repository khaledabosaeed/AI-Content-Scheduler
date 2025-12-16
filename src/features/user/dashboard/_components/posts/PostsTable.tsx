"use client";

import type { Post } from "@/entities/user/type/Post";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

function StatusBadge({ status }: { status: string }) {
  const s = (status || "draft").toLowerCase();

  if (s === "published") return <Badge>Published</Badge>;
  if (s === "scheduled") return <Badge variant="secondary">Scheduled</Badge>;
  if (s === "failed") return <Badge variant="destructive">Failed</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}

type Props = {
  posts?: Post[];
  isLoading: boolean;

  // ✅ coming from PostsPage
  hasFacebook?: boolean;
  
  publishingId?: string | null;

  onPublishFacebook?: (postId: string) => void;
  onCancelSchedule?: (postId: string) => void;

  // ✅ this replaces onSchedule
  onOpenSchedule?: (post: Post) => void;
};

export function PostsTable({
  posts = [],
  isLoading,
  hasFacebook = false,
  publishingId = null,
  onPublishFacebook,
  onCancelSchedule,
  onOpenSchedule,
}: Props) {
  const safeOpenSchedule = (post: Post) => {
    if (typeof onOpenSchedule !== "function") {
      console.error("onOpenSchedule is missing or not a function", {
        onOpenSchedule,
      });
      return;
    }
    onOpenSchedule(post);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Posts</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            No posts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr className="text-left text-muted-foreground">
                  <th className="p-3">Platform</th>
                  <th className="p-3">Content</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {posts.map((p) => {
                  const status = (p.status || "draft").toLowerCase();
                  const isScheduled = status === "scheduled";
                  const isPublished = status === "published";

                  return (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="p-3 font-medium">
                        {p.platform?.toUpperCase() || "TWITTER"}
                      </td>

                      <td className="p-3 max-w-[500px] line-clamp-2">
                        {p.content}
                      </td>

                      <td className="p-3">
                        <StatusBadge status={p.status} />
                      </td>

                      <td className="p-3 text-muted-foreground">
                        {p.scheduled_at
                          ? new Date(p.scheduled_at).toLocaleString("en-GB")
                          : new Date(p.createdAt).toLocaleString("en-GB")}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          {/* ✅ Schedule (opens modal) */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => safeOpenSchedule(p)}
                          >
                            Schedule
                          </Button>

                          {/* ✅ Cancel schedule */}
                          {isScheduled &&
                            typeof onCancelSchedule === "function" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onCancelSchedule(p.id)}
                              >
                                Cancel
                              </Button>
                            )}

                          {/* ✅ Publish to Facebook */}
                          {hasFacebook &&
                            !isPublished &&
                            typeof onPublishFacebook === "function" && (
                              <Button
                                size="sm"
                                disabled={publishingId === p.id}
                                onClick={() => onPublishFacebook(p.id)}
                              >
                                {publishingId === p.id
                                  ? "Publishing..."
                                  : "Publish"}
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
        )}
      </CardContent>
    </Card>
  );
}
