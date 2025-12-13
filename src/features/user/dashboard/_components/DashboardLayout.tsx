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
        <DashboardHeader onRefresh={() => {}} />
      </div>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <DashboardSidebar />
        {/* Main content */}
        <main className="flex-1 min-w-0 p-6">{children}</main>
      </div>
    </div>
  );
}
