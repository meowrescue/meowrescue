
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Define the types for our lost and found posts
export interface LostFoundPost {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  location: string;
  status: "lost" | "found" | "reunited" | "archived";
  pet_type: string;
  pet_name?: string;
  date_occurred: string;
  contact_info: string;
  photos_urls?: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

// Define the types for comments
export interface Comment {
  id: string;
  post_id: string;
  profile_id: string;
  content: string;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

// Define the types for chat sessions
export interface ChatSession {
  id: string;
  user_id: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
  last_message_at: string;
  user?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

// Define the types for chat messages
export interface ChatMessage {
  id: string;
  chat_session_id: string;
  user_id?: string;
  admin_id?: string;
  content: string;
  is_admin: boolean;
  created_at: string;
  read_at?: string;
}

// This type is used to define the type safe database interface
export type Database = {
  public: {
    Tables: {
      lost_found_posts: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          description: string;
          location: string;
          status: string;
          pet_type: string;
          pet_name: string | null;
          date_occurred: string;
          contact_info: string | null;
          photos_urls: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          description: string;
          location: string;
          status: string;
          pet_type?: string;
          pet_name?: string | null;
          date_occurred: string;
          contact_info?: string | null;
          photos_urls?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          description?: string;
          location?: string;
          status?: string;
          pet_type?: string;
          pet_name?: string | null;
          date_occurred?: string;
          contact_info?: string | null;
          photos_urls?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lost_found_posts_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          created_at: string;
          updated_at: string;
          last_message_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          last_message_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          last_message_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      chat_messages: {
        Row: {
          id: string;
          chat_session_id: string;
          user_id: string | null;
          admin_id: string | null;
          content: string;
          is_admin: boolean;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          chat_session_id: string;
          user_id?: string | null;
          admin_id?: string | null;
          content: string;
          is_admin?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          chat_session_id?: string;
          user_id?: string | null;
          admin_id?: string | null;
          content?: string;
          is_admin?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_session_id_fkey";
            columns: ["chat_session_id"];
            referencedRelation: "chat_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_admin_id_fkey";
            columns: ["admin_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          profile_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          profile_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          profile_id?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "lost_found_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_comments_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      adoption_applications: {
        Row: {
          applicant_details: Json
          applicant_profile_id: string | null
          cat_id: string | null
          created_at: string
          id: string
          notes: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
          updated_at: string
        }
        Insert: {
          applicant_details: Json
          applicant_profile_id?: string | null
          cat_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          applicant_details?: Json
          applicant_profile_id?: string | null
          cat_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adoption_applications_applicant_profile_id_fkey"
            columns: ["applicant_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adoption_applications_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_profile_id: string | null
          content: string
          created_at: string
          featured_image_url: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_profile_id?: string | null
          content: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_profile_id?: string | null
          content?: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_profile_id_fkey"
            columns: ["author_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cats: {
        Row: {
          age_estimate: string | null
          bio: string | null
          breed: string | null
          created_at: string
          description: string | null
          foster_profile_id: string | null
          gender: string | null
          id: string
          intake_date: string
          medical_notes: string | null
          name: string
          photos_urls: string[] | null
          status: Database["public"]["Enums"]["cat_status"]
          updated_at: string
        }
        Insert: {
          age_estimate?: string | null
          bio?: string | null
          breed?: string | null
          created_at?: string
          description?: string | null
          foster_profile_id?: string | null
          gender?: string | null
          id?: string
          intake_date?: string
          medical_notes?: string | null
          name: string
          photos_urls?: string[] | null
          status?: Database["public"]["Enums"]["cat_status"]
          updated_at?: string
        }
        Update: {
          age_estimate?: string | null
          bio?: string | null
          breed?: string | null
          created_at?: string
          description?: string | null
          foster_profile_id?: string | null
          gender?: string | null
          id?: string
          intake_date?: string
          medical_notes?: string | null
          name?: string
          photos_urls?: string[] | null
          status?: Database["public"]["Enums"]["cat_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cats_foster_profile_id_fkey"
            columns: ["foster_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          email: string
          id: string
          message: string
          name: string
          received_at: string
          responded_at: string | null
          response: string | null
          status: Database["public"]["Enums"]["message_status"]
        }
        Insert: {
          email: string
          id?: string
          message: string
          name: string
          received_at?: string
          responded_at?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["message_status"]
        }
        Update: {
          email?: string
          id?: string
          message?: string
          name?: string
          received_at?: string
          responded_at?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["message_status"]
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          block_identifier: string
          content: string
          created_at: string
          id: string
          page: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          block_identifier: string
          content: string
          created_at?: string
          id?: string
          page: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          block_identifier?: string
          content?: string
          created_at?: string
          id?: string
          page?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donation_date: string
          donor_profile_id: string | null
          id: string
          is_recurring: boolean
          notes: string | null
          payment_gateway_id: string | null
          status: string
          income_type: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          donation_date?: string
          donor_profile_id?: string | null
          id?: string
          is_recurring?: boolean
          notes?: string | null
          payment_gateway_id?: string | null
          status?: string
          income_type?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          donation_date?: string
          donor_profile_id?: string | null
          id?: string
          is_recurring?: boolean
          notes?: string | null
          payment_gateway_id?: string | null
          status?: string
          income_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_profile_id_fkey"
            columns: ["donor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string
          event_date_end: string
          event_date_start: string
          id: string
          image_url: string | null
          location: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          event_date_end: string
          event_date_start: string
          id?: string
          image_url?: string | null
          location: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          event_date_end?: string
          event_date_start?: string
          id?: string
          image_url?: string | null
          location?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      foster_assignments: {
        Row: {
          cat_id: string
          created_at: string
          end_date: string | null
          foster_profile_id: string
          id: string
          notes: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          cat_id: string
          created_at?: string
          end_date?: string | null
          foster_profile_id: string
          id?: string
          notes?: string | null
          start_date?: string
          updated_at?: string
        }
        Update: {
          cat_id?: string
          created_at?: string
          end_date?: string | null
          foster_profile_id?: string
          id?: string
          notes?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "foster_assignments_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foster_assignments_foster_profile_id_fkey"
            columns: ["foster_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          state: string | null
          updated_at: string
          zip: string | null
          role_title: string | null
          show_in_team: boolean | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          state?: string | null
          updated_at?: string
          zip?: string | null
          role_title?: string | null
          show_in_team?: boolean | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          state?: string | null
          updated_at?: string
          zip?: string | null
          role_title?: string | null
          show_in_team?: boolean | null
        }
        Relationships: []
      }
      resource_links: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          email: string
          first_name: string | null
          id: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          adoption_date: string | null
          cat_id: string | null
          created_at: string
          id: string
          photo_url: string | null
          story_text: string
          title: string
          updated_at: string
        }
        Insert: {
          adoption_date?: string | null
          cat_id?: string | null
          created_at?: string
          id?: string
          photo_url?: string | null
          story_text: string
          title: string
          updated_at?: string
        }
        Update: {
          adoption_date?: string | null
          cat_id?: string | null
          created_at?: string
          id?: string
          photo_url?: string | null
          story_text?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "success_stories_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_logs: {
        Row: {
          activity_description: string
          created_at: string
          hours: number
          id: string
          log_date: string
          updated_at: string
          volunteer_profile_id: string
        }
        Insert: {
          activity_description: string
          created_at?: string
          hours: number
          id?: string
          log_date?: string
          updated_at?: string
          volunteer_profile_id: string
        }
        Update: {
          activity_description?: string
          created_at?: string
          hours?: number
          id?: string
          log_date?: string
          updated_at?: string
          volunteer_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_logs_volunteer_profile_id_fkey"
            columns: ["volunteer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          id: string;
          amount: number;
          expense_date: string;
          description: string;
          category: string;
          vendor: string;
          payment_method: string;
          receipt_url: string | null;
          donation_id: string | null;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          amount: number;
          expense_date?: string;
          description: string;
          category: string;
          vendor: string;
          payment_method: string;
          receipt_url?: string | null;
          donation_id?: string | null;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          amount?: number;
          expense_date?: string;
          description?: string;
          category?: string;
          vendor?: string;
          payment_method?: string;
          receipt_url?: string | null;
          donation_id?: string | null;
          created_at?: string;
          created_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_donation_id_fkey";
            columns: ["donation_id"];
            referencedRelation: "donations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          activity_type: string;
          description: string;
          ip_address: string | null;
          created_at: string;
          metadata: any | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          activity_type: string;
          description: string;
          ip_address?: string | null;
          created_at?: string;
          metadata?: any | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          activity_type?: string;
          description?: string;
          ip_address?: string | null;
          created_at?: string;
          metadata?: any | null;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      applications: {
        Row: {
          id: string;
          applicant_id: string;
          application_type: string;
          status: string;
          form_data: Record<string, any>;
          created_at: string;
          updated_at: string;
          reviewed_at?: string;
          reviewer_id?: string;
          feedback?: string;
        };
        Insert: {
          id?: string;
          applicant_id: string;
          application_type: string;
          status: string;
          form_data: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          reviewed_at?: string;
          reviewer_id?: string;
          feedback?: string;
        };
        Update: {
          id?: string;
          applicant_id?: string;
          application_type?: string;
          status?: string;
          form_data?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          reviewed_at?: string;
          reviewer_id?: string;
          feedback?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey";
            columns: ["applicant_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      is_foster: {
        Args: { uid: string }
        Returns: boolean
      }
      is_volunteer: {
        Args: { uid: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "volunteer" | "foster" | "admin"
      application_status: "Submitted" | "Under Review" | "Approved" | "Rejected"
      cat_status: "Available" | "Pending" | "Adopted"
      message_status: "New" | "Read" | "Replied" | "Archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
