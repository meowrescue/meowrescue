
export interface ActivityLog {
  id: string;
  activity_type: string;
  user_id: string;
  user_email?: string;
  description: string;
  ip_address?: string;
  created_at: string;
  metadata?: any;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
  };
}
