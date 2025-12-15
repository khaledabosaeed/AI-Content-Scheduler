"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/libs/chadcn/utils";
import { Button } from "@/shared/components/ui/button";
import { useLogoutMutation } from "../../logout/useLogout";

import {
  Menu,
  LogOut,
  Plus,
  LayoutDashboard,
  Home,
  MessageSquare,
  FileText,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/shared/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

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

function NavLinks({
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

export function MobileCreatePostSelect() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white text-slate-900 hover:bg-slate-100 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onSelect={() => router.push("/chat")}>
          Create from Chat
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => router.push("/dashboard/posts?new=draft")}
        >
          New Draft
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => router.push("/dashboard/posts?new=scheduled")}
        >
          Schedule Post
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => router.push("/dashboard/posts?new=facebook")}
        >
          Facebook Post
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => router.push("/dashboard/posts")}>
          View Posts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardMobileMenuButton() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.replace("/login"),
    });
  };

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/10 hover:bg-white/15 text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[290px] p-0 bg-gradient-to-b from-slate-950 to-slate-900 text-white border-white/10"
        >
          <SheetHeader className="p-4 border-b border-white/10">
            <SheetTitle className="text-white">Menu</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            <div className="flex-1">
              <NavLinks
                variant="mobile"
                onNavigate={(href) => router.push(href)}
              />
            </div>

            <div className="p-4 border-t border-white/10 space-y-2">
              <SheetClose asChild>
                <Button
                  className="w-full justify-start bg-white text-slate-900 hover:bg-slate-100"
                  onClick={() => router.push("/chat")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </SheetClose>

              <Button
                variant="secondary"
                className="w-full justify-start bg-white/10 hover:bg-white/15 text-white"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {logoutMutation.isPending ? "Logging out..." : "Log out"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
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
        "hidden md:flex w-[260px] h-auto shrink-0",
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

      <div className="p-4 border-t border-white/10 space-y-2">
        <Button
          asChild
          className="w-full bg-white text-slate-900 hover:bg-slate-100"
        >
          <Link href="/chat">+ Create Post</Link>
        </Button>

        <Button
          variant="secondary"
          className="w-full bg-white/10 hover:bg-white/15 text-white"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </aside>
  );
}
