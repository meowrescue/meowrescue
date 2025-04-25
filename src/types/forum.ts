
// Define types to complement the existing Supabase types

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  profile_id: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_locked: boolean;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

export interface ForumComment {
  id: string;
  post_id: string;
  profile_id: string;
  content: string;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}
