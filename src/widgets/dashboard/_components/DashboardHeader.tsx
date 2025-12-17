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

          <div className="text-white bg-transparent">
            <ThemeToggle />
          </div>

          {/* Mobile create post */}
          <div className="">
            <MobileCreatePostSelect />
          </div>

          
          {/* <SaveButton
            message={{
              id: "new",
              content: "",
              role: "user",
              createdAt: "",
              role: "user" as any,
              createdAt: new Date() as any,
            }}
            prompt=""
            buttonText="+ Create Post"
            className="md:inline-flex bg-white text-slate-900 hover:bg-slate-100 shadow-sm font-medium px-4 py-2 rounded-md"
          /> */}
        </div>
      </div>
    </div>
  );
}
