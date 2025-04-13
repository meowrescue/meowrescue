
export interface TeamMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string | null;
  role: string;
  role_title?: string | null;
  bio?: string | null;
  show_in_team: boolean;
  created_at: string;
}
