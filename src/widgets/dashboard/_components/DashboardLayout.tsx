"use client";

import { PostsLoader } from "@/features/posts";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { ScheduleModalContainer } from "./ScheduleModalContainer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PostsLoader>
      <div dir="ltr" className="min-h-screen bg-muted/40">
        <div className="sticky top-0 z-40">
          <DashboardHeader />
        </div>

        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 md:ml-[260px] min-h-screen overflow-y-auto p-6">
            {children}
          </main>
        </div>
        <ScheduleModalContainer />
      </div>
    </PostsLoader>
  );
}
