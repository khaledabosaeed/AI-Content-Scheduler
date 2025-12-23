// src/entities/posts/index.ts

/**
 * Posts Entity - Barrel Export
 *
 * يصدر كل ما يتعلق بالـ Posts من مكان واحد
 */

// Store
export { usePostsStore } from "./model/posts-store";

// Types
export type { PostsState } from "./model/types";

// Re-export Post type for convenience
export type { Post } from  "./model/types";
