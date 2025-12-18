'use client';

import { SaveButton } from "@/features/chat";
import { Button } from "@/shared/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Plus, MessageSquare, FileText, Calendar, Share2, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";

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
            onSelect={() => router.push("/dashboard/posts?tab=drafts")}
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
            onSelect={() => router.push("/dashboard/posts?tab=scheduled")}
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
            onSelect={() => router.push("/dashboard/posts?tab=published")}
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
          onSelect={() => router.push("/dashboard/posts?tab=all")}
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
