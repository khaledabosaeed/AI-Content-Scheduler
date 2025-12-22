// src/entities/posts/model/posts-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PostsState } from "./types";
import type { Post } from "@/entities/user/type/Post";
import { api } from "@/shared/api/api-client";

/**
 * Posts Store - إدارة حالة المنشورات باستخدام Zustand
 *
 * Features:
 * - ✅ Optimistic updates للـ delete
 * - ✅ Facebook integration
 * - ✅ Schedule modal management
 * - ✅ Error handling
 * - ✅ Persistent hasFacebook status
 */
export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      // Initial State 
      posts: [],
      isLoading: false,
      isFetching: false,
      publishingId: null,
      deletingId: null,
      error: null,
      hasFacebook: null,
      isScheduleOpen: false,
      scheduleInitialContent: "",

      //  Data Management Actions 

      setPosts: (posts: Post[]) => {
        set({ posts });
      },

      fetchPosts: async () => {
        set({ isFetching: true, error: null });

        try {
          const res = await api.get("posts", { cache: "no-store" });
          const list = res?.posts ?? res ?? [];
          const posts = Array.isArray(list) ? list : [];

          set({ posts, isFetching: false });
        } catch (err: any) {
          console.error("fetchPosts error:", err);
          set({
            isFetching: false,
            error: err?.message ?? "Failed to fetch posts",
          });
        }
      },

      addPost: (post: Post) => {
        set((state) => ({
          posts: [post, ...state.posts],
        }));
      },

      updatePost: (postId: string, updates: Partial<Post>) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, ...updates } : post
          ),
        }));
      },

      deletePost: async (postId: string) => {
        const state = get();
        const previousPosts = state.posts;

        try {
          set({ deletingId: postId });

          set((state) => ({
            posts: state.posts.filter((post) => post.id !== postId),
          }));

          // 🌐 API call
          await api.delete(`posts/${postId}/delete-post`);

          set({ deletingId: null });
        } catch (err: any) {
          console.error("deletePost error:", err);

          set({
            posts: previousPosts,
            deletingId: null,
            error: err?.message ?? "Failed to delete post",
          });

          throw err;
        }
      },

      //  Facebook Integration Actions 

      fetchFacebookStatus: async () => {
        try {
          const res = await api.get("facebook/me");
          const hasFacebook = !!res?.hasFacebook;

          set({ hasFacebook });

          // ✅ Sync to localStorage for SSR
          if (typeof window !== "undefined") {
            window.localStorage.setItem("hasFacebook", hasFacebook ? "1" : "0");
          }
        } catch (err: any) {
          console.error("fetchFacebookStatus error:", err);
          set({ hasFacebook: false });

          if (typeof window !== "undefined") {
            window.localStorage.setItem("hasFacebook", "0");
          }
        }
      },

      publishToFacebook: async (postId: string) => {
        try {
          set({ publishingId: postId });

          await api.post("facebook/publish", { postId });

          // ✅ Refresh posts after publish
          await get().fetchPosts();

          set({ publishingId: null });
        } catch (err: any) {
          console.error("publishToFacebook error:", err);
          set({
            publishingId: null,
            error: err?.message ?? "Failed to publish to Facebook",
          });

          throw err;
        }
      },

      //  Schedule Management Actions 

      openScheduleModal: (post: Post) => {
        const content = post?.content ?? (post as any)?.prompt ?? "";
        set({
          scheduleInitialContent: content,
          isScheduleOpen: true,
        });
      },

      closeScheduleModal: () => {
        set({
          isScheduleOpen: false,
          scheduleInitialContent: "",
        });
      },

      cancelSchedule: async (postId: string) => {
        try {
          await api.post(`posts/${postId}/cancel-schedule`, { method: "POST" });

          // ✅ Refresh posts after canceling schedule
          await get().fetchPosts();
        } catch (err: any) {
          console.error("cancelSchedule error:", err);
          set({
            error: err?.message ?? "Failed to cancel schedule",
          });

          throw err;
        }
      },

      //  Utility Actions 

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          posts: [],
          isLoading: false,
          isFetching: false,
          publishingId: null,
          deletingId: null,
          error: null,
          isScheduleOpen: false,
          scheduleInitialContent: "",
        });
      },
    }),
    {
      name: "posts-storage",
      // ✅ Persist only hasFacebook status
      partialize: (state) => ({
        hasFacebook: state.hasFacebook,
      }),
    }
  )
);



// export const postsSelectors = {
//   // Data
//   posts: (state: PostsState) => state.posts,
//   postsCount: (state: PostsState) => state.posts.length,

//   // Loading states
//   isLoading: (state: PostsState) => state.isLoading,
//   isFetching: (state: PostsState) => state.isFetching,
//   isPublishing: (postId: string) => (state: PostsState) =>
//   state.publishingId === postId,
//   isDeleting: (postId: string) => (state: PostsState) =>
//   state.deletingId === postId,

//   // Facebook
//   hasFacebook: (state: PostsState) => state.hasFacebook,

//   // Schedule modal
//   scheduleModal: (state: PostsState) => ({
//     isOpen: state.isScheduleOpen,
//     initialContent: state.scheduleInitialContent,
//   }),

//   // Error
//   error: (state: PostsState) => state.error,

//   // Actions
//   actions: (state: PostsState) => ({
//     fetchPosts: state.fetchPosts,
//     addPost: state.addPost,
//     updatePost: state.updatePost,
//     deletePost: state.deletePost,
//     publishToFacebook: state.publishToFacebook,
//     fetchFacebookStatus: state.fetchFacebookStatus,
//     openScheduleModal: state.openScheduleModal,
//     closeScheduleModal: state.closeScheduleModal,
//     cancelSchedule: state.cancelSchedule,
//     setError: state.setError,
//     clearError: state.clearError,
//     reset: state.reset,
//   }),
// };


