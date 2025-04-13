
export interface User {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  bio?: string;
  avatar_url?: string;
  role?: 'user' | 'volunteer' | 'foster' | 'admin';
  role_title?: string; // Add this property
  created_at?: string;
  updated_at?: string;
}
