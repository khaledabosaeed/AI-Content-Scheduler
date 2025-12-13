import { StatusBadge } from "./StatusBadge";
import { SaveButton } from "@/features/chat";
import type { Post } from "@/entities/user/type/Post";

export function PostRow({
  post,
  onRefresh,
}: {
  post: Post;
  onRefresh: () => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 border-b text-sm">
      <div className="col-span-2 font-medium">
        {post.platform.toUpperCase()}
      </div>

      <div className="col-span-5 line-clamp-2">{post.content}</div>

      <div className="col-span-2">
        <StatusBadge status={post.status} />
      </div>

      <div className="col-span-3 flex justify-end gap-2">
        {post.status === "draft" && (
          <SaveButton
            message={{ id: post.id, content: post.content }}
            prompt={post.prompt}
            buttonText="Schedule"
          />
        )}
      </div>
    </div>
  );
}
