"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/libs/chadcn/utils";
import { Button } from "@/shared/components/ui/button";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Posts", href: "/dashboard/posts" },
  { label: "Calendar", href: "/dashboard/calendar" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Scheduling", href: "/dashboard/scheduling" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside
      dir="ltr"
      className={cn(
        " top-0 h-screen w-[260px] shrink-0 border-r",
        "bg-gradient-to-b from-slate-950 to-slate-900 text-white",
        "flex flex-col"
      )}
    >
      {/* Nav */}
      <nav className="p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname !== null &&
              item.href !== "/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm transition",
                "hover:bg-white/10",
                isActive && "bg-white/10 ring-1 ring-white/10"
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full mr-3",
                  isActive ? "bg-primary" : "bg-white/30"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom CTA (push to bottom) */}
      <div className="mt-auto p-4 border-t border-white/10">
        <Button asChild className="w-full">
          <Link href="/chat">+ Create Post</Link>
        </Button>
      </div>
    </aside>
  );
}
