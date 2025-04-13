
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
  role_title?: string;
  show_in_team?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Adding ExtendedUser interface that was referenced in AdminUsers.tsx
export interface ExtendedUser extends User {
  application_count?: number;
  donation_count?: number;
  is_active?: boolean;
}
