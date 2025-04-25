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
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
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
            foreignKeyName: "adoption_applications_applicant_profile_id_fkey"
            columns: ["applicant_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "adoption_applications_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adoption_applications_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["cat_id"]
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
        Relationships: [
          {
            foreignKeyName: "fk_applicant"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applicant"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_profile_id: string | null
          canonical_url: string | null
          content: string
          created_at: string
          featured_image_url: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          keywords: string[] | null
          meta_description: string | null
          published_at: string | null
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_profile_id?: string | null
          canonical_url?: string | null
          content: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          keywords?: string[] | null
          meta_description?: string | null
          published_at?: string | null
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_profile_id?: string | null
          canonical_url?: string | null
          content?: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          keywords?: string[] | null
          meta_description?: string | null
          published_at?: string | null
          slug?: string
          summary?: string | null
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
          {
            foreignKeyName: "blog_posts_author_profile_id_fkey"
            columns: ["author_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      budget_categories: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          year: number
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          year: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      business_licenses: {
        Row: {
          created_at: string
          document_id: string | null
          expiry_date: string | null
          id: string
          issue_date: string
          issuing_authority: string
          license_number: string
          license_type: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_id?: string | null
          expiry_date?: string | null
          id?: string
          issue_date: string
          issuing_authority: string
          license_number: string
          license_type: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_id?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string
          issuing_authority?: string
          license_number?: string
          license_type?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_licenses_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
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
          {
            foreignKeyName: "cat_feeding_records_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["cat_id"]
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
      cat_medical_records: {
        Row: {
          cat_id: string
          cost: number | null
          created_at: string
          description: string
          id: string
          notes: string | null
          procedure_type: string
          record_date: string
          updated_at: string
          veterinarian: string | null
        }
        Insert: {
          cat_id: string
          cost?: number | null
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          procedure_type: string
          record_date?: string
          updated_at?: string
          veterinarian?: string | null
        }
        Update: {
          cat_id?: string
          cost?: number | null
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          procedure_type?: string
          record_date?: string
          updated_at?: string
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cat_medical_records_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cat_medical_records_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["cat_id"]
          },
        ]
      }
      cat_vaccinations: {
        Row: {
          administered_by: string | null
          administered_date: string | null
          batch_number: string | null
          cat_id: string
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          updated_at: string
          vaccine_name: string
        }
        Insert: {
          administered_by?: string | null
          administered_date?: string | null
          batch_number?: string | null
          cat_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          vaccine_name: string
        }
        Update: {
          administered_by?: string | null
          administered_date?: string | null
          batch_number?: string | null
          cat_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cat_vaccinations_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cat_vaccinations_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["cat_id"]
          },
        ]
      }
      cats: {
        Row: {
          age_estimate: string | null
          bio: string | null
          birthday: string | null
          breed: string | null
          coat_type: string | null
          created_at: string
          description: string | null
          foster_profile_id: string | null
          gender: string | null
          id: string
          intake_date: string
          internal_status: string | null
          medical_notes: string | null
          name: string
          photos_urls: string[] | null
          status: Database["public"]["Enums"]["cat_status"]
          updated_at: string
        }
        Insert: {
          age_estimate?: string | null
          bio?: string | null
          birthday?: string | null
          breed?: string | null
          coat_type?: string | null
          created_at?: string
          description?: string | null
          foster_profile_id?: string | null
          gender?: string | null
          id?: string
          intake_date?: string
          internal_status?: string | null
          medical_notes?: string | null
          name: string
          photos_urls?: string[] | null
          status?: Database["public"]["Enums"]["cat_status"]
          updated_at?: string
        }
        Update: {
          age_estimate?: string | null
          bio?: string | null
          birthday?: string | null
          breed?: string | null
          coat_type?: string | null
          created_at?: string
          description?: string | null
          foster_profile_id?: string | null
          gender?: string | null
          id?: string
          intake_date?: string
          internal_status?: string | null
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
          {
            foreignKeyName: "cats_foster_profile_id_fkey"
            columns: ["foster_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          admin_id: string | null
          chat_session_id: string
          content: string
          created_at: string
          id: string
          is_admin: boolean
          read_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_id?: string | null
          chat_session_id: string
          content: string
          created_at?: string
          id?: string
          is_admin?: boolean
          read_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_id?: string | null
          chat_session_id?: string
          content?: string
          created_at?: string
          id?: string
          is_admin?: boolean
          read_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_session_id_fkey"
            columns: ["chat_session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          guest_name: string | null
          guest_reason: string | null
          id: string
          last_message_at: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          guest_name?: string | null
          guest_reason?: string | null
          id?: string
          last_message_at?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          guest_name?: string | null
          guest_reason?: string | null
          id?: string
          last_message_at?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          received_at: string
          responded_at: string | null
          response: string | null
          status: string
          subject: string | null
        }
        Insert: {
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          received_at?: string
          responded_at?: string | null
          response?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          received_at?: string
          responded_at?: string | null
          response?: string | null
          status?: string
          subject?: string | null
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
          {
            foreignKeyName: "content_blocks_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      document_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          cat_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          donation_id: string | null
          expense_id: string | null
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          supply_id: string | null
          title: string
          updated_at: string
          uploader_id: string | null
        }
        Insert: {
          cat_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          donation_id?: string | null
          expense_id?: string | null
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          supply_id?: string | null
          title: string
          updated_at?: string
          uploader_id?: string | null
        }
        Update: {
          cat_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          donation_id?: string | null
          expense_id?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          supply_id?: string | null
          title?: string
          updated_at?: string
          uploader_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["cat_id"]
          },
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donation_usage_summary"
            referencedColumns: ["donation_id"]
          },
          {
            foreignKeyName: "documents_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["donation_id"]
          },
          {
            foreignKeyName: "documents_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["expense_id"]
          },
          {
            foreignKeyName: "documents_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["supply_id"]
          },
          {
            foreignKeyName: "documents_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "supplies"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_allocations: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          description: string | null
          donation_id: string
          expense_id: string | null
          id: string
          supply_transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          description?: string | null
          donation_id: string
          expense_id?: string | null
          id?: string
          supply_transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          description?: string | null
          donation_id?: string
          expense_id?: string | null
          id?: string
          supply_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_allocations_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donation_usage_summary"
            referencedColumns: ["donation_id"]
          },
          {
            foreignKeyName: "donation_allocations_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_allocations_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["donation_id"]
          },
          {
            foreignKeyName: "donation_allocations_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["expense_id"]
          },
          {
            foreignKeyName: "donation_allocations_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_allocations_supply_transaction_id_fkey"
            columns: ["supply_transaction_id"]
            isOneToOne: false
            referencedRelation: "supply_transactions"
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
          income_type: string | null
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
          income_type?: string | null
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
          income_type?: string | null
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
          {
            foreignKeyName: "donations_donor_profile_id_fkey"
            columns: ["donor_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          date: string | null
          date_end: string
          date_start: string
          description: string
          id: string
          image_url: string | null
          location: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          date_end: string
          date_start: string
          description: string
          id?: string
          image_url?: string | null
          location: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string | null
          date_end?: string
          date_start?: string
          description?: string
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
          cat_id: string | null
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
          cat_id?: string | null
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
          cat_id?: string | null
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
            foreignKeyName: "expenses_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["cat_id"]
          },
          {
            foreignKeyName: "expenses_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donation_usage_summary"
            referencedColumns: ["donation_id"]
          },
          {
            foreignKeyName: "expenses_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["donation_id"]
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
            foreignKeyName: "foster_assignments_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["cat_id"]
          },
          {
            foreignKeyName: "foster_assignments_foster_profile_id_fkey"
            columns: ["foster_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foster_assignments_foster_profile_id_fkey"
            columns: ["foster_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      foster_home_evaluations: {
        Row: {
          approved: boolean
          comments: string | null
          created_at: string
          evaluation_date: string
          evaluator_id: string | null
          has_other_pets: boolean | null
          has_yard: boolean | null
          home_size: string | null
          household_members: number | null
          id: string
          other_pets_details: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          approved?: boolean
          comments?: string | null
          created_at?: string
          evaluation_date?: string
          evaluator_id?: string | null
          has_other_pets?: boolean | null
          has_yard?: boolean | null
          home_size?: string | null
          household_members?: number | null
          id?: string
          other_pets_details?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          approved?: boolean
          comments?: string | null
          created_at?: string
          evaluation_date?: string
          evaluator_id?: string | null
          has_other_pets?: boolean | null
          has_yard?: boolean | null
          home_size?: string | null
          household_members?: number | null
          id?: string
          other_pets_details?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "foster_home_evaluations_evaluator_id_fkey"
            columns: ["evaluator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foster_home_evaluations_evaluator_id_fkey"
            columns: ["evaluator_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "foster_home_evaluations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foster_home_evaluations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fundraising_campaigns: {
        Row: {
          amount_raised: number | null
          campaign_type: string
          created_at: string
          description: string
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          start_date: string
          target_amount: number
          updated_at: string
        }
        Insert: {
          amount_raised?: number | null
          campaign_type: string
          created_at?: string
          description: string
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          start_date: string
          target_amount: number
          updated_at?: string
        }
        Update: {
          amount_raised?: number | null
          campaign_type?: string
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          start_date?: string
          target_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          added_by: string
          created_at: string
          group_id: string
          user_id: string
        }
        Insert: {
          added_by: string
          created_at?: string
          group_id: string
          user_id: string
        }
        Update: {
          added_by?: string
          created_at?: string
          group_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_group_members_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "message_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_message_reads: {
        Row: {
          message_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          message_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          message_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_message_reads_message"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "group_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_group_messages_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "message_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      income: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          description: string
          id: string
          income_date: string
          income_type: string
          receipt_url: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          income_date?: string
          income_type: string
          receipt_url?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          income_date?: string
          income_type?: string
          receipt_url?: string | null
        }
        Relationships: []
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
      message_groups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
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
          role_title: string | null
          show_in_team: boolean | null
          state: string | null
          unread_chat_count: number | null
          unread_message_count: number | null
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
          role_title?: string | null
          show_in_team?: boolean | null
          state?: string | null
          unread_chat_count?: number | null
          unread_message_count?: number | null
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
          role_title?: string | null
          show_in_team?: boolean | null
          state?: string | null
          unread_chat_count?: number | null
          unread_message_count?: number | null
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
          show_on_homepage: boolean | null
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
          show_on_homepage?: boolean | null
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
          show_on_homepage?: boolean | null
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
          {
            foreignKeyName: "success_stories_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["cat_id"]
          },
        ]
      }
      supplies: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          minimum_quantity: number
          name: string
          quantity: number
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          minimum_quantity?: number
          name: string
          quantity?: number
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          minimum_quantity?: number
          name?: string
          quantity?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      supply_order_items: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string
          quantity: number
          supply_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          quantity: number
          supply_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          quantity?: number
          supply_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supply_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "supply_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supply_order_items_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["supply_id"]
          },
          {
            foreignKeyName: "supply_order_items_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "supplies"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          foster_id: string
          id: string
          notes: string | null
          rejected_reason: string | null
          status: string
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          foster_id: string
          id?: string
          notes?: string | null
          rejected_reason?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          foster_id?: string
          id?: string
          notes?: string | null
          rejected_reason?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      supply_transactions: {
        Row: {
          cat_id: string | null
          created_at: string
          created_by: string
          donation_id: string | null
          expense_id: string | null
          foster_id: string | null
          id: string
          notes: string | null
          quantity: number
          supply_id: string
          transaction_type: string
        }
        Insert: {
          cat_id?: string | null
          created_at?: string
          created_by: string
          donation_id?: string | null
          expense_id?: string | null
          foster_id?: string | null
          id?: string
          notes?: string | null
          quantity: number
          supply_id: string
          transaction_type: string
        }
        Update: {
          cat_id?: string | null
          created_at?: string
          created_by?: string
          donation_id?: string | null
          expense_id?: string | null
          foster_id?: string | null
          id?: string
          notes?: string | null
          quantity?: number
          supply_id?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "supply_transactions_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supply_transactions_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["cat_id"]
          },
          {
            foreignKeyName: "supply_transactions_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donation_usage_summary"
            referencedColumns: ["donation_id"]
          },
          {
            foreignKeyName: "supply_transactions_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supply_transactions_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["donation_id"]
          },
          {
            foreignKeyName: "supply_transactions_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["expense_id"]
          },
          {
            foreignKeyName: "supply_transactions_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supply_transactions_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "donor_donation_usage"
            referencedColumns: ["supply_id"]
          },
          {
            foreignKeyName: "supply_transactions_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "supplies"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          email: string | null
          id: string
          is_active: boolean
          name: string
          photo_url: string | null
          profile_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          photo_url?: string | null
          profile_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          photo_url?: string | null
          profile_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
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
          {
            foreignKeyName: "volunteer_logs_volunteer_profile_id_fkey"
            columns: ["volunteer_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      donation_usage_summary: {
        Row: {
          allocated_amount: number | null
          allocation_count: number | null
          donation_amount: number | null
          donation_date: string | null
          donation_id: string | null
          donor_profile_id: string | null
          remaining_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_profile_id_fkey"
            columns: ["donor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_profile_id_fkey"
            columns: ["donor_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      donor_donation_usage: {
        Row: {
          allocation_amount: number | null
          allocation_description: string | null
          allocation_id: string | null
          cat_id: string | null
          cat_name: string | null
          donation_amount: number | null
          donation_date: string | null
          donation_id: string | null
          donor_profile_id: string | null
          expense_category: string | null
          expense_date: string | null
          expense_description: string | null
          expense_id: string | null
          receipt_url: string | null
          supply_category: string | null
          supply_id: string | null
          supply_name: string | null
          vendor: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_profile_id_fkey"
            columns: ["donor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_profile_id_fkey"
            columns: ["donor_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profile_view: {
        Row: {
          avatar_url: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      add_supply: {
        Args: {
          p_name: string
          p_description: string
          p_category: string
          p_unit: string
          p_minimum_quantity: number
        }
        Returns: {
          id: string
          name: string
          description: string
          category: string
          unit: string
          quantity: number
          minimum_quantity: number
          created_at: string
          updated_at: string
        }[]
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
      delete_donation: {
        Args: { p_donation_id: string }
        Returns: boolean
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
      get_recent_donors: {
        Args: { limit_count?: number }
        Returns: {
          name: string
          amount: number
          date: string
          is_anonymous: boolean
        }[]
      }
      get_top_donors: {
        Args: { limit_count?: number }
        Returns: {
          name: string
          amount: number
          date: string
          is_anonymous: boolean
        }[]
      }
      get_unread_counts: {
        Args: { user_id: string }
        Returns: Json
      }
      get_user_status: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      is_chat_admin: {
        Args: Record<PropertyKey, never>
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
      log_activity: {
        Args: {
          p_activity_type: string
          p_description: string
          p_metadata?: Json
        }
        Returns: string
      }
      send_contact_reply: {
        Args: { p_message_id: string; p_reply: string }
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
      app_role: "user" | "volunteer" | "foster" | "admin" | "staff"
      application_status: "Submitted" | "Under Review" | "Approved" | "Rejected"
      cat_procedure_type:
        | "Vaccination"
        | "Surgery"
        | "Check-up"
        | "Medication"
        | "Test"
        | "Other"
      cat_status: "Available" | "Pending" | "Adopted"
      message_status: "New" | "Read" | "Replied" | "Archived"
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
      app_role: ["user", "volunteer", "foster", "admin", "staff"],
      application_status: ["Submitted", "Under Review", "Approved", "Rejected"],
      cat_procedure_type: [
        "Vaccination",
        "Surgery",
        "Check-up",
        "Medication",
        "Test",
        "Other",
      ],
      cat_status: ["Available", "Pending", "Adopted"],
      message_status: ["New", "Read", "Replied", "Archived"],
    },
  },
} as const
