
export interface User {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  role: "user" | "volunteer" | "foster" | "admin";
  role_title?: string | null;
  show_in_team?: boolean | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}
