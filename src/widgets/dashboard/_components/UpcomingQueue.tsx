import type { Post } from "@/entities/user/type/Post";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

export function UpcomingQueue({ posts }: { posts: Post[] }) {
  const upcoming = posts
    .filter((p: any) => p.status === "scheduled" && p.scheduled_at)
    .sort(
      (a: any, b: any) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at)
    )
    .slice(0, 5);

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Upcoming Queue</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {!upcoming.length ? (
          <p className="text-sm text-muted-foreground">
            No upcoming scheduled posts.
          </p>
        ) : (
          upcoming.map((p: any) => (
            <div key={p.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {(p.platform || "twitter").toString().toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {p.content}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(p.scheduled_at).toLocaleString("en-GB")}
                </p>
              </div>
              <Badge variant="secondary">Scheduled</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
