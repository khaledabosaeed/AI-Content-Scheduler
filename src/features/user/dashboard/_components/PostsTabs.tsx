"use client";

import type { Post } from "@/entities/user/type/Post";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { RecentPostsTable } from "./RecentPostsTable"; 

type Props = {
  posts: Post[];
  hasFacebook: boolean;
  onSchedule?: (post: Post) => void;
  onPublish?: (postId: string) => Promise<void> | void;
  onCancelSchedule?: (postId: string) => Promise<void> | void;
  publishingId?: string | null;
  onDelete: (postId: string) => Promise<void> | void;
  onRefresh: () => Promise<void>;
  setPosts?: React.Dispatch<React.SetStateAction<Post[]>>;
};

export function PostsTabs({
  posts,
  onSchedule,
  onPublish,
  onCancelSchedule,
  onDelete,
  setPosts,
}: Props) {
  const all = posts;
  const scheduled = posts.filter(
    (p: any) => (p.status || "").toLowerCase() === "scheduled"
  );
  const drafts = posts.filter(
    (p: any) => (p.status || "").toLowerCase() === "draft"
  );
  const published = posts.filter(
    (p: any) => (p.status || "").toLowerCase() === "published"
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Posts</h2>
        <p className="text-sm text-muted-foreground">
          Browse recent posts and manage scheduling.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <RecentPostsTable
            posts={all}
            emptyText="No posts yet."
            onSchedule={onSchedule}
            onPublish={onPublish}
            onCancelSchedule={onCancelSchedule}
            onDelete={onDelete}
            setPosts={setPosts}
          />
        </TabsContent>

        <TabsContent value="scheduled" className="mt-4">
          <RecentPostsTable
            posts={scheduled}
            emptyText="No scheduled posts."
            onPublish={onPublish}
            onCancelSchedule={onCancelSchedule}
            onDelete={onDelete}
            setPosts={setPosts}
          />
        </TabsContent>

        <TabsContent value="drafts" className="mt-4">
          <RecentPostsTable
            posts={drafts}
            emptyText="No drafts."
            onSchedule={onSchedule}
            onDelete={onDelete}
            setPosts={setPosts}
          />
        </TabsContent>
        <TabsContent value="published" className="mt-4">
          <RecentPostsTable
            posts={published}
            emptyText="No published posts."
            onPublish={onPublish}
            onDelete={onDelete}
            setPosts={setPosts}
            // publishingId={publishingId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
