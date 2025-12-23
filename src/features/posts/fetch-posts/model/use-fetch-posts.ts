

import { useEffect } from "react";
import { usePostsStore } from "@/entities/posts";



export function useFetchPosts(autoFetch: boolean = true) {
  

  const {isFetching , error , fetchPosts} = usePostsStore()



  const fetchFacebookStatus = usePostsStore(
    (state) => state.fetchFacebookStatus
  );

  useEffect(() => {
    if (autoFetch) {
      // ✅ Fetch posts and Facebook status in parallel
      Promise.all([fetchPosts(), fetchFacebookStatus()]).catch((err) => {
        console.error("Failed to fetch initial data:", err);
      });
    }

  }, [autoFetch, fetchPosts, fetchFacebookStatus]);


  return {
    isFetching,
    error,
    refetch: fetchPosts,
  };

}
