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
  unread_chat_count?: number;
  unread_message_count?: number;
}

export interface ExtendedUser extends User {
  // Additional properties specific to users with extended information
  // This type is used in AdminUsers.tsx
}

// Chat related types
export interface ChatSession {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  user?: User;
}

export interface ChatMessage {
  id: string;
  chat_session_id: string;
  user_id?: string | null;
  admin_id?: string | null;
  content: string;
  is_admin: boolean;
  created_at: string;
  read_at?: string | null;
}

// Message status type
export type MessageStatus = "New" | "Read" | "Replied" | "Archived";
