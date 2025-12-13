import type { Post } from "@/entities/user/type/Post";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

function StatusBadge({ status }: { status: string }) {
  if (status === "published") return <Badge>Published</Badge>;
  if (status === "scheduled")
    return <Badge variant="secondary">Scheduled</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}

export function RecentPostsTable({
  posts,
  emptyText,
}: {
  posts: Post[];
  emptyText: string;
}) {
  if (!posts.length) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {emptyText}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
      </CardHeader>

      <CardContent className="p-0 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr className="text-left text-muted-foreground">
                <th className="p-3">Platform</th>
                <th className="p-3">Content</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {posts.slice(0, 10).map((post: any) => (
                <tr key={post.id} className="border-b last:border-b-0">
                  <td className="p-3 font-medium">
                    {(post.platform || "twitter").toString().toUpperCase()}
                  </td>

                  <td className="p-3">
                    <div className="line-clamp-2 max-w-[520px]">
                      {post.content || "-"}
                    </div>
                  </td>

                  <td className="p-3">
                    <StatusBadge status={post.status || "draft"} />
                  </td>

                  <td className="p-3 text-muted-foreground">
                    {post.scheduled_at
                      ? new Date(post.scheduled_at).toLocaleString("en-GB")
                      : post.created_at
                      ? new Date(post.created_at).toLocaleString("en-GB")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
