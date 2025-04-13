
export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  email?: string;
  role?: 'user' | 'volunteer' | 'foster' | 'admin';
  role_title?: string; // Add this property
  show_in_team?: boolean; // Add this property
  bio?: string;
  created_at?: string;
}
