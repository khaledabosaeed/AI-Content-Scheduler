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
  Share2,
  FolderOpen,
  Calendar,
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { SaveButton } from "@/features/chat";

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
        <Button className="bg-primary text-white shadow-md transition-all duration-200 hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 p-2 bg-background text-slate-900 border-white/10"
      >
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1.5">
          Quick Actions
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={() => router.push("/chat")}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-colors hover:bg-action-hover focus:bg-accent"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm text-foreground">
                Create from Chat
              </span>
              <span className="text-xs text-muted-foreground">
                Start with AI assistance
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => router.push("/dashboard/posts?new=draft")}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-colors hover:bg-action-hover focus:bg-accent"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm text-foreground">
                New Draft
              </span>
              <span className="text-xs text-muted-foreground">
                Save for later editing
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => router.push("/dashboard/posts?new=scheduled")}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-colors hover:bg-action-hover focus:bg-accent"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm text-foreground">
                Schedule Post
              </span>
              <span className="text-xs text-muted-foreground">
                Plan ahead publication
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => router.push("/dashboard/posts?new=facebook")}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-colors hover:bg-action-hover focus:bg-accent"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Share2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm text-foreground">
                Facebook Post
              </span>
              <span className="text-xs text-muted-foreground">
                Share on social media
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 bg-border" />

        <DropdownMenuItem
          onSelect={() => router.push("/dashboard/posts")}
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-colors hover:bg[hsl(var(--action-hover))/10] focus:bg-accent"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-500/10 text-slate-600 dark:bg-slate-400/20 dark:text-slate-400">
            <FolderOpen className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm text-foreground">
              View All Posts
            </span>
            <span className="text-xs text-muted-foreground">
              Browse your content
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-border" />
        <Button
          asChild
          size="sm"
          variant="outline"
          className="w-full justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm hover:shadow-md transition-all duration-200 font-medium"
        >
          <SaveButton
            message={{
              id: "new",
              content: "",
              role: "user" as any,
              createdAt: "" as any,
            }}
            prompt=""
            buttonText="+ Create Post "
            onSaved={()=>console.log("Done!")}
            className="w-full justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm hover:shadow-md transition-all duration-200 font-medium h-9 rounded-md"
          />
        </Button>
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

            <div className="p-4 border-t border-white/10">
              <SheetClose asChild>
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white/10 hover:bg-white/15 text-white"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {logoutMutation.isPending ? "Logging out..." : "Log out"}
                </Button>
              </SheetClose>
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
