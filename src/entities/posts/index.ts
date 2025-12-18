// src/entities/posts/index.ts

/**
 * Posts Entity - Barrel Export
 *
 * يصدر كل ما يتعلق بالـ Posts من مكان واحد
 */

// Store
export { usePostsStore, postsSelectors } from "./model/posts-store";

// Types
export type { PostsState } from "./model/types";

// Re-export Post type for convenience
export type { Post } from "@/entities/user/type/Post";
