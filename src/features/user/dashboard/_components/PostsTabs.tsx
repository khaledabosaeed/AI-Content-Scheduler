import type { Post } from "@/entities/user/type/Post";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { RecentPostsTable } from "./RecentPostsTable";

export function PostsTabs({ posts }: { posts: Post[] }) {
  const all = posts;
  const scheduled = posts.filter((p: any) => p.status === "scheduled");
  const drafts = posts.filter((p: any) => p.status === "draft");
  const published = posts.filter((p: any) => p.status === "published");

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
