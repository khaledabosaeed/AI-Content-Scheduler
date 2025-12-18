"use client";

import Link from "next/link";
import {
} from "./DashboardSidebar";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { MobileCreatePostSelect } from "./MobileDropMune";
import { DashboardMobileMenuButton } from "./DashboardMobileMenuButton";

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

          <div className="text-white bg-transparent">
            <ThemeToggle />
          </div>

          {/* Mobile create post */}
          <div className="">
            <MobileCreatePostSelect />
          </div>


        </div>
      </div>
    </div>
  );
}
