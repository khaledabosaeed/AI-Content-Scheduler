"use client";

import { createContext, useContext } from "react";
import type { Post } from "@/entities/user/type/Post";

type PostsContextType = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({
  value,
  children,
}: {
  value: PostsContextType;
  children: React.ReactNode;
}) {
  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
}

export function usePostsContext() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePostsContext must be used inside PostsProvider");
  }
  return context;
}

