
export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'user' | 'volunteer' | 'foster' | 'admin';
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  bio: string | null;
  is_active?: boolean; // Added as optional for backward compatibility
}
