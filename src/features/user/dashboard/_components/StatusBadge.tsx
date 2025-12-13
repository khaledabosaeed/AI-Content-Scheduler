import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  if (status === "published") return <Badge>Published</Badge>;
  if (status === "scheduled")
    return <Badge variant="secondary">Scheduled</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}
