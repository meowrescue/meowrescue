
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Define the types for our lost and found posts
export interface LostFoundPost {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  location: string;
  status: "lost" | "found" | "reunited";
  pet_type: string;
  pet_name?: string;
  date_occurred: string;
  contact_info: string;
  photos_urls?: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

// Define the types for comments
export interface Comment {
  id: string;
  post_id: string;
  profile_id: string;
  content: string;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}
