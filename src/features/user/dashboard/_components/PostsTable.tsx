import { PostRow } from "./PostRow";
import type { Post } from "@/entities/user/type/Post";

export function PostsTable({
  posts,
  loading,
  onRefresh,
}: {
  posts: Post[];
  loading: boolean;
  onRefresh: () => void;
}) {
  if (loading) return <p>Loading...</p>;
  if (!posts.length)
    return <p className="text-muted-foreground">No posts yet</p>;

  return (
    <div className="rounded-xl border bg-background">
      {posts.map((post) => (
        <PostRow key={post.id} post={post} onRefresh={onRefresh} />
      ))}
    </div>
  );
}
