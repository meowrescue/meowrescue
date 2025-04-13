
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
}

export type MessageStatus = 'New' | 'Read' | 'Replied' | 'Archived';
