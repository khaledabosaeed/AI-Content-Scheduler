import type { Post } from "@/entities/user/type/Post";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

export function AlertsPanel({ posts }: { posts: Post[] }) {
  // مثال: لو عندك status = "failed"
  const failed = posts.filter((p: any) => p.status === "failed").length;

  const items = [
    { label: "Disconnected accounts", value: 0, tone: "outline" as const },
    {
      label: "Failed posts",
      value: failed,
      tone: failed ? ("destructive" as const) : ("outline" as const),
    },
    { label: "Needs review", value: 0, tone: "outline" as const },
  ];

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Needs Attention</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between">
            <p className="text-sm">{it.label}</p>
            <Badge variant={it.tone}>{it.value}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
