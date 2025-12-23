// src/entities/posts/model/types.ts


export interface Post {
  created_at: string | null | undefined;
  scheduled_at: any;
  id: string;
  content: string;
  prompt?: string;
  platform: string;
  status: string;
  createdAt: string;
}


export interface PostsState {

  posts: Post[];
  //  Loading
  isLoading: boolean;
  isFetching: boolean;
  publishingId: string | null;
  deletingId: string | null;
  post?:Post
  
  //  Error State 
  error: string | null;

  //  Facebook  
  hasFacebook: boolean | null;

  //  Schedule 
  isScheduleOpen: boolean;
  scheduleInitialContent: string;

   
  // update the array 
  setPosts: (posts: Post[]) => void;
  fetchPosts: () => Promise<void>;

// post mangment 
  addPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => Promise<void>;
  publishToFacebook: (postId: string) => Promise<void>;



  // Actions Facebook
  fetchFacebookStatus: () => Promise<void>;



  //  Schedule Management
  openScheduleModal: (post: Post) => void;
  closeScheduleModal: () => void;
  cancelSchedule: (postId: string) => Promise<void>;
  

  // 
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  
}
