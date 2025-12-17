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
