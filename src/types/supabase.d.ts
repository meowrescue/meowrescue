
import { User } from '@/types/users';

export interface ChatSession {
  id: string;
  user_id: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
  last_message_at: string;
  user?: User;
}

export interface ChatMessage {
  id: string;
  chat_session_id: string;
  content: string;
  created_at: string;
  is_admin: boolean;
  admin_id?: string;
  user_id?: string;
  read_at?: string;
}

export interface Application {
  id: string;
  user_id: string;
  applicant_id: string;
  application_type: 'adoption' | 'foster' | 'volunteer';
  status: 'pending' | 'approved' | 'rejected' | 'in-review';
  form_data: any;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  feedback?: string;
  profiles?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}
