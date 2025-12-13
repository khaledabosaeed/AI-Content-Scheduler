import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export function DashboardHeader({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div dir="ltr" className="rounded-xl border bg-card">
      {/* Top bar (dark/gradient like the screenshot) */}
      <div className="flex items-center justify-between rounded-t-xl border-b bg-gradient-to-b from-slate-900 to-slate-800 px-5 py-4">
        <h1 className="text-xl font-semibold text-white">Post Scheduling</h1>

        <div className="flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/chat">+ Create Post</Link>
          </Button>
        </div>
      </div>

  
    </div>
  );
}
