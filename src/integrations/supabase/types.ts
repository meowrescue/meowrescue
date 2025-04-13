export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      applications: {
        Row: {
          applicant_id: string | null
          application_type: string
          created_at: string
          feedback: string | null
          form_data: Json
          id: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id?: string | null
          application_type: string
          created_at?: string
          feedback?: string | null
          form_data: Json
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string | null
          application_type?: string
          created_at?: string
          feedback?: string | null
          form_data?: Json
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      cat_feeding_records: {
        Row: {
          amount: number
          cat_food_id: string
          cat_id: string
          created_at: string
          feeding_date: string
          id: string
        }
        Insert: {
          amount: number
          cat_food_id: string
          cat_id: string
          created_at?: string
          feeding_date?: string
          id?: string
        }
        Update: {
          amount?: number
          cat_food_id?: string
          cat_id?: string
          created_at?: string
          feeding_date?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cat_feeding_records_cat_food_id_fkey"
            columns: ["cat_food_id"]
            isOneToOne: false
            referencedRelation: "cat_food"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cat_feeding_records_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
      cat_food: {
        Row: {
          brand: string
          cost_per_unit: number
          created_at: string
          id: string
          purchase_date: string
          quantity: number
          type: string
          units: string
        }
        Insert: {
          brand: string
          cost_per_unit: number
          created_at?: string
          id?: string
          purchase_date?: string
          quantity: number
          type: string
          units: string
        }
        Update: {
          brand?: string
          cost_per_unit?: number
          created_at?: string
          id?: string
          purchase_date?: string
          quantity?: number
          type?: string
          units?: string
        }
        Relationships: []
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
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          description: string
          donation_id: string | null
          expense_date: string
          id: string
          payment_method: string
          receipt_url: string | null
          vendor: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          created_by?: string | null
          description: string
          donation_id?: string | null
          expense_date?: string
          id?: string
          payment_method: string
          receipt_url?: string | null
          vendor: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          donation_id?: string | null
          expense_date?: string
          id?: string
          payment_method?: string
          receipt_url?: string | null
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
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
      lost_found_posts: {
        Row: {
          contact_info: string | null
          created_at: string
          date_occurred: string
          description: string
          id: string
          location: string
          pet_name: string | null
          pet_type: string
          photos_urls: string[] | null
          profile_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          contact_info?: string | null
          created_at?: string
          date_occurred: string
          description: string
          id?: string
          location: string
          pet_name?: string | null
          pet_type: string
          photos_urls?: string[] | null
          profile_id: string
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          contact_info?: string | null
          created_at?: string
          date_occurred?: string
          description?: string
          id?: string
          location?: string
          pet_name?: string | null
          pet_type?: string
          photos_urls?: string[] | null
          profile_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          profile_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "lost_found_posts"
            referencedColumns: ["id"]
          },
        ]
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
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          state: string | null
          updated_at: string
          zip: string | null
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
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          state?: string | null
          updated_at?: string
          zip?: string | null
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
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          state?: string | null
          updated_at?: string
          zip?: string | null
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
      user_status: {
        Row: {
          created_at: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_cat_feeding_record: {
        Args:
          | {
              p_cat_id: string
              p_cat_food_id: string
              p_amount: number
              p_feeding_date: string
            }
          | {
              p_cat_id: string
              p_cat_food_id: string
              p_amount: number
              p_feeding_date: string
            }
        Returns: string
      }
      add_cat_food: {
        Args:
          | {
              p_brand: string
              p_type: string
              p_quantity: number
              p_units: string
              p_cost_per_unit: number
              p_purchase_date: string
            }
          | {
              p_brand: string
              p_type: string
              p_quantity: number
              p_units: string
              p_cost_per_unit: number
              p_purchase_date: string
            }
        Returns: string
      }
      create_application: {
        Args: {
          p_applicant_id: string
          p_application_type: string
          p_status: string
          p_form_data: Json
        }
        Returns: string
      }
      get_applications: {
        Args: { p_status?: string; p_type?: string }
        Returns: {
          applicant_id: string | null
          application_type: string
          created_at: string
          feedback: string | null
          form_data: Json
          id: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          updated_at: string
        }[]
      }
      get_cat_feeding_records: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          cat_id: string
          cat_food_id: string
          amount: number
          feeding_date: string
          created_at: string
          cat_name: string
          food_brand: string
          food_type: string
        }[]
      }
      get_cat_food: {
        Args: Record<PropertyKey, never>
        Returns: {
          brand: string
          cost_per_unit: number
          created_at: string
          id: string
          purchase_date: string
          quantity: number
          type: string
          units: string
        }[]
      }
      get_user_status: {
        Args: { user_id: string }
        Returns: boolean
      }
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
      update_application_status: {
        Args: {
          p_application_id: string
          p_status: string
          p_feedback?: string
        }
        Returns: undefined
      }
      update_user_status: {
        Args: { p_user_id: string; p_is_active: boolean }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "user" | "volunteer" | "foster" | "admin"
      application_status: "Submitted" | "Under Review" | "Approved" | "Rejected"
      cat_status: "Available" | "Pending" | "Adopted"
      message_status: "New" | "Read" | "Replied"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "volunteer", "foster", "admin"],
      application_status: ["Submitted", "Under Review", "Approved", "Rejected"],
      cat_status: ["Available", "Pending", "Adopted"],
      message_status: ["New", "Read", "Replied"],
    },
  },
} as const
