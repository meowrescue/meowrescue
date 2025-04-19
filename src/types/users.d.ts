
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    role?: string;
    [key: string]: any;
  };
  raw_user_meta_data?: any;
  created_at?: string;
}

export type MessageStatus = 'New' | 'Read' | 'Replied' | 'Archived';
