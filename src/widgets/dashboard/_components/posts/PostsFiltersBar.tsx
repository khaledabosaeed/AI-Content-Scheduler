"use client";

import { Button } from "@/shared/components/ui/button";

export function PostsFiltersBar({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <div className="text-sm text-muted-foreground">
          Filters coming next (search / status / platform)
        </div>
      </div>

      <Button variant="outline" onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  );
}
