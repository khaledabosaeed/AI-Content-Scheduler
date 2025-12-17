import type { Post } from "@/entities/user/type/Post";
import { Card, CardContent } from "@/shared/components/ui/card";

export function StatsCards({ posts }: { posts: Post[] }) {
  const total = posts.length;
  const scheduled = posts.filter((p: any) => p.status === "scheduled").length;
  const drafts = posts.filter((p: any) => p.status === "draft").length;
  const published = posts.filter((p: any) => p.status === "published").length;

  const items = [
    { label: "Total Posts", value: total },
    { label: "Scheduled", value: scheduled },
    { label: "Drafts", value: drafts },
    { label: "Published", value: published },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
