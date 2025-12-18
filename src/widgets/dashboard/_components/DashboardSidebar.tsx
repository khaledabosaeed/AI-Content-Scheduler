"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/libs/chadcn/utils";
import { Button } from "@/shared/components/ui/button";

import {
  LogOut,
  LayoutDashboard,
  Home,
  MessageSquare,
  FileText,

} from "lucide-react";


import { useLogoutMutation } from "@/features/user/logout/useLogout";

type NavItem = { label: string; href: string; icon: any };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Home", href: "/", icon: Home },
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "Posts", href: "/dashboard/posts", icon: FileText },
];

function useActivePath() {
  const pathname = usePathname();
  const isItemActive = (href: string) =>
    pathname === href ||
    (!!pathname && href !== "/" && pathname.startsWith(href));
  return { isItemActive };
}

export function NavLinks({
  onNavigate,
  variant,
}: {
  onNavigate?: (href: string) => void;
  variant: "desktop" | "mobile";
}) {
  const { isItemActive } = useActivePath();

  return (
    <nav
      className={cn(variant === "desktop" ? "p-4 space-y-2" : "p-4 space-y-2")}
    >
      {NAV_ITEMS.map((item) => {
        const active = isItemActive(item.href);
        const Icon = item.icon;

        const base =
          "w-full flex items-center gap-3 rounded-lg px-4 py-3 text-base transition hover:bg-white/10";
        const activeCls = "bg-white/10 ring-1 ring-white/10";

        if (variant === "desktop") {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(base, active && activeCls)}
            >
              <Icon className="h-5 w-5 opacity-90" />
              <span className="flex-1">{item.label}</span>
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  active ? "bg-primary" : "bg-white/30"
                )}
              />
            </Link>
          );
        }

        // mobile: button + onNavigate
        return (
          <button
            key={item.href}
            onClick={() => onNavigate?.(item.href)}
            className={cn(base, "text-left", active && activeCls)}
          >
            <Icon className="h-5 w-5 opacity-90" />
            <span className="flex-1">{item.label}</span>
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                active ? "bg-primary" : "bg-white/30"
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}



export function DashboardSidebar() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.replace("/login"),
    });
  };

  return (
    <aside
      dir="ltr"
      className={cn(
        "hidden md:flex mb-5",
        "fixed top-[64px] left-0 z-30",
        "w-[260px] h-[calc(100vh-64px)]",
        "shrink-0 overflow-hidden",
        "border-r bg-gradient-to-b from-slate-950 to-slate-900 text-white",
        "flex-col"
      )}
    >
      <div className="px-4 pt-5 pb-4 border-b border-white/10">
        <div className="text-sm uppercase tracking-widest text-white/60">
          Navigation
        </div>
      </div>

      <div className="flex-1">
        <NavLinks variant="desktop" />
      </div>

      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="
      w-full
      flex items-center gap-3
      px-4 py-3
      text-white
      hover:bg-white/10
      justify-start
    "
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <span className="flex-1 text-left">
            {logoutMutation.isPending ? "Logging out..." : "Log out"}
          </span>

          <LogOut className="h-5 w-5 opacity-90" />
        </Button>
      </div>
    </aside>
  );
}
