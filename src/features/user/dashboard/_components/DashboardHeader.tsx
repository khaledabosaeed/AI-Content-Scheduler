"use client";

import Link from "next/link";
import {
  DashboardMobileMenuButton,
  MobileCreatePostSelect,
} from "./DashboardSidebar";
import SaveButton from "@/features/chat/save-as-post/ui/SaveButton";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

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
          {/* Mobile create post */}
          <div className="md:hidden">
            <MobileCreatePostSelect />
          </div>

          <div className="text-white bg-transparent">
            <ThemeToggle />
          </div>
          <SaveButton
            message={{
              id: "",
              content: "",
              role: "user",
              createdAt: new Date(),
            }}
            prompt=""
            buttonText="+ Create Post"
            className="hidden md:inline-flex bg-white text-slate-900 hover:bg-slate-100 shadow-sm font-medium px-4 py-2 rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
