import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="ltr" className="min-h-screen bg-muted/40">
      <div className="sticky top-0 z-40">
        <DashboardHeader />
      </div>

      <div className="flex min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 min-w-0 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
