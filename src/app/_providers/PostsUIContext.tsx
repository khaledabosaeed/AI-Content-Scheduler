import { createContext, useContext } from "react";
import type { Post } from "@/entities/user/type/Post";
export type PostsUIContextType = {
  hasFacebook: boolean;
  publishingId: string | null;
  onSchedule?: (post: Post) => void;
  onPublish?: (postId: string) => Promise<void> | void;
  onCancelSchedule?: (postId: string) => Promise<void> | void;
  onDelete: (postId: string) => Promise<void> | void;
  refreshPosts?: () => Promise<void>;
};
const PostsUIContext = createContext<PostsUIContextType | undefined>(undefined);
export function PostsUIProvider({
  value,
  children,
}: {
  value: PostsUIContextType;
  children: React.ReactNode;
}) {
  return (
    <PostsUIContext.Provider value={value}>{children}</PostsUIContext.Provider>
  );
}
export function usePostsUI() {
  const ctx = useContext(PostsUIContext);
  if (!ctx) throw new Error("usePostsUI must be used inside PostsUIProvider");
  return ctx;
}

export function usePostsUIOptional() {
  return useContext(PostsUIContext);
}