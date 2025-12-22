"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { RecentPostsTable } from "./RecentPostsTable";
import { usePostsStore } from "@/entities/posts";

interface PostsTabsProps {
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

export function PostsTabs({ defaultTab = "all", onTabChange }: PostsTabsProps) {


  const [activeTab, setActiveTab] = useState(defaultTab);
  const {posts} = usePostsStore();

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  const { all, scheduled, drafts, published } = useMemo(() => {
    const norm = (s: any) => (s || "").toString().toLowerCase();
    const list = posts ?? [];

    return {
      all: list,
      scheduled: list.filter((p: any) => norm(p.status) === "scheduled"),
      drafts: list.filter((p: any) => norm(p.status) === "draft"),
      published: list.filter((p: any) => norm(p.status) === "published"),
    };
  }, [posts]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Posts</h2>
        <p className="text-sm text-muted-foreground">
          Browse recent posts and manage scheduling.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <RecentPostsTable posts={all} emptyText="No posts yet." />
        </TabsContent>

        <TabsContent value="scheduled" className="mt-4">
          <RecentPostsTable posts={scheduled} emptyText="No scheduled posts." />
        </TabsContent>

        <TabsContent value="drafts" className="mt-4">
          <RecentPostsTable posts={drafts} emptyText="No drafts." />
        </TabsContent>

        <TabsContent value="published" className="mt-4">
          <RecentPostsTable posts={published} emptyText="No published posts." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
