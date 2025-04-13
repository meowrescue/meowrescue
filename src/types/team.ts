

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  email?: string;
  role?: 'user' | 'volunteer' | 'foster' | 'admin';
  role_title?: string;
  show_in_team?: boolean;
  bio?: string;
  created_at?: string;
}

