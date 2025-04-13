
// Define forum types to complement the existing Supabase types

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profile_id: string;
  description?: string;
  location?: string;
  status?: string;
  pet_type?: string;
  category?: string;
  is_pinned?: boolean;
  is_locked?: boolean;
  photos_urls?: string[];
  date_occurred?: string;
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
