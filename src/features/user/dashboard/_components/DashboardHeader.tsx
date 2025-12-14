"use client";

import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import {
  DashboardMobileMenuButton,
  MobileCreatePostSelect,
} from "./DashboardSidebar";

export function DashboardHeader() {
  return (
    <div dir="ltr" className="rounded-xl bg-card">
      <div className="flex items-center justify-between bg-gradient-to-b from-slate-900 to-slate-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <DashboardMobileMenuButton />
          <div className="p-2 text-white">
            <Link href="/" className="text-xl font-bold tracking-wide">
              AI Content Scheduler
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <MobileCreatePostSelect />
          </div>

          <Button
            asChild
            className="hidden md:inline-flex bg-white text-slate-900 hover:bg-slate-100 shadow-sm font-medium"
          >
            <Link href="/chat">+ Create Post</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
