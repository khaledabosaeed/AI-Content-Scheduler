// src/features/posts/fetch-posts/ui/PostsLoader.tsx
"use client";

import { useFetchPosts } from "../model/use-fetch-posts";
import { usePostsStore } from "@/entities/posts";

interface PostsLoaderProps {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: (error: string, retry: () => void) => React.ReactNode;
}



export function PostsLoader({
  children,
  loadingFallback,
  errorFallback,
}: PostsLoaderProps) {
  const { isFetching, error, refetch } = useFetchPosts();
  const posts = usePostsStore((state) => state.posts);


  if (isFetching && posts.length === 0 && loadingFallback) {
    return <>{loadingFallback}</>;
  }

  // ❌ Show error
  if (error && !isFetching) {
    return (
      <>
        {errorFallback ? (
          errorFallback(error, refetch)
        ) : (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <p className="text-destructive text-sm">Error: {error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        )}
      </>
    );
  }

  // ✅ Show children (they handle their own loading states)
  return <>{children}</>;
}
