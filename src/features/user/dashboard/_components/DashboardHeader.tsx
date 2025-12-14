import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export function DashboardHeader({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div dir="ltr" className="rounded-xl bg-card">
      <div className="flex items-center justify-between bg-gradient-to-b from-slate-900 to-slate-800 px-5 py-4">
        <h1 className="text-xl font-semibold text-white">Post Scheduling</h1>

        <Button
          asChild
          className="
            bg-white
            text-slate-900
            hover:bg-slate-100
            shadow-sm
            font-medium
          "
        >
          <Link href="/chat">+ Create Post</Link>
        </Button>
      </div>
    </div>
  );
}
