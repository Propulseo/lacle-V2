// Types generes depuis Supabase (projet La cle: pxohzbjijyklgoznhibf).
// NE PAS editer a la main : regenerer via le MCP supabase / supabase gen types.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bloc_progress: {
        Row: {
          bloc_id: string
          exam_passed: boolean
          id: string
          learner_id: string
          status: Database["public"]["Enums"]["progress_status"]
          unlocked_at: string | null
          updated_at: string
        }
        Insert: {
          bloc_id: string
          exam_passed?: boolean
          id?: string
          learner_id: string
          status?: Database["public"]["Enums"]["progress_status"]
          unlocked_at?: string | null
          updated_at?: string
        }
        Update: {
          bloc_id?: string
          exam_passed?: boolean
          id?: string
          learner_id?: string
          status?: Database["public"]["Enums"]["progress_status"]
          unlocked_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bloc_progress_bloc_id_fkey"
            columns: ["bloc_id"]
            isOneToOne: false
            referencedRelation: "blocs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bloc_progress_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blocs: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          created_at: string
          description: string | null
          formation_id: string
          id: string
          is_published: boolean
          numero: number
          position: number
          titre: string
          updated_at: string
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string
          description?: string | null
          formation_id: string
          id?: string
          is_published?: boolean
          numero: number
          position: number
          titre: string
          updated_at?: string
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string
          description?: string | null
          formation_id?: string
          id?: string
          is_published?: boolean
          numero?: number
          position?: number
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocs_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      cas_pratique_submissions: {
        Row: {
          cas_pratique_id: string
          corrected_at: string | null
          corrector_feedback: string | null
          corrector_id: string | null
          essai_number: number
          id: string
          learner_id: string
          response: string
          score: number | null
          status: Database["public"]["Enums"]["submission_status"]
          submitted_at: string
        }
        Insert: {
          cas_pratique_id: string
          corrected_at?: string | null
          corrector_feedback?: string | null
          corrector_id?: string | null
          essai_number: number
          id?: string
          learner_id: string
          response: string
          score?: number | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string
        }
        Update: {
          cas_pratique_id?: string
          corrected_at?: string | null
          corrector_feedback?: string | null
          corrector_id?: string | null
          essai_number?: number
          id?: string
          learner_id?: string
          response?: string
          score?: number | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cas_pratique_submissions_cas_pratique_id_fkey"
            columns: ["cas_pratique_id"]
            isOneToOne: false
            referencedRelation: "cas_pratiques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cas_pratique_submissions_corrector_id_fkey"
            columns: ["corrector_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cas_pratique_submissions_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cas_pratiques: {
        Row: {
          consignes: string | null
          created_at: string
          formation_id: string
          id: string
          max_essais: number
          numero: number
          situation: string
          title: string
          updated_at: string
        }
        Insert: {
          consignes?: string | null
          created_at?: string
          formation_id: string
          id?: string
          max_essais?: number
          numero: number
          situation: string
          title: string
          updated_at?: string
        }
        Update: {
          consignes?: string | null
          created_at?: string
          formation_id?: string
          id?: string
          max_essais?: number
          numero?: number
          situation?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cas_pratiques_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          learner_id: string
          notion_id: string | null
          role: Database["public"]["Enums"]["chat_role"]
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          learner_id: string
          notion_id?: string | null
          role: Database["public"]["Enums"]["chat_role"]
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          learner_id?: string
          notion_id?: string | null
          role?: Database["public"]["Enums"]["chat_role"]
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_messages_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_messages_notion_id_fkey"
            columns: ["notion_id"]
            isOneToOne: false
            referencedRelation: "notion_responses_by_learner"
            referencedColumns: ["notion_id"]
          },
          {
            foreignKeyName: "chatbot_messages_notion_id_fkey"
            columns: ["notion_id"]
            isOneToOne: false
            referencedRelation: "notion_responses_global"
            referencedColumns: ["notion_id"]
          },
          {
            foreignKeyName: "chatbot_messages_notion_id_fkey"
            columns: ["notion_id"]
            isOneToOne: false
            referencedRelation: "notions"
            referencedColumns: ["id"]
          },
        ]
      }
      cours: {
        Row: {
          access_tier: Database["public"]["Enums"]["access_tier"]
          bloc_id: string
          created_at: string
          id: string
          numero: number
          position: number
          titre: string | null
          updated_at: string
        }
        Insert: {
          access_tier?: Database["public"]["Enums"]["access_tier"]
          bloc_id: string
          created_at?: string
          id?: string
          numero: number
          position: number
          titre?: string | null
          updated_at?: string
        }
        Update: {
          access_tier?: Database["public"]["Enums"]["access_tier"]
          bloc_id?: string
          created_at?: string
          id?: string
          numero?: number
          position?: number
          titre?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cours_bloc_id_fkey"
            columns: ["bloc_id"]
            isOneToOne: false
            referencedRelation: "blocs"
            referencedColumns: ["id"]
          },
        ]
      }
      course_item_vault_links: {
        Row: {
          created_at: string
          id: string
          item_id: string
          vault_document_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          vault_document_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          vault_document_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_item_vault_links_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "course_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_item_vault_links_vault_document_id_fkey"
            columns: ["vault_document_id"]
            isOneToOne: false
            referencedRelation: "learner_vault_view"
            referencedColumns: ["vault_document_id"]
          },
          {
            foreignKeyName: "course_item_vault_links_vault_document_id_fkey"
            columns: ["vault_document_id"]
            isOneToOne: false
            referencedRelation: "vault_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      course_items: {
        Row: {
          cours_id: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["course_item_kind"]
          position: number
          updated_at: string
        }
        Insert: {
          cours_id: string
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["course_item_kind"]
          position: number
          updated_at?: string
        }
        Update: {
          cours_id?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["course_item_kind"]
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_items_cours_id_fkey"
            columns: ["cours_id"]
            isOneToOne: false
            referencedRelation: "cours"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed_at: string | null
          cours_id: string
          id: string
          last_access_at: string | null
          learner_id: string
          status: Database["public"]["Enums"]["progress_status"]
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          cours_id: string
          id?: string
          last_access_at?: string | null
          learner_id: string
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          cours_id?: string
          id?: string
          last_access_at?: string | null
          learner_id?: string
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_cours_id_fkey"
            columns: ["cours_id"]
            isOneToOne: false
            referencedRelation: "cours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_reminders: {
        Row: {
          channel: Database["public"]["Enums"]["reminder_channel"]
          id: string
          learner_id: string
          level: number
          responded_at: string | null
          sent_at: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["reminder_channel"]
          id?: string
          learner_id: string
          level: number
          responded_at?: string | null
          sent_at?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["reminder_channel"]
          id?: string
          learner_id?: string
          level?: number
          responded_at?: string | null
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_reminders_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_tracking: {
        Row: {
          last_connection_at: string | null
          last_progress_at: string | null
          learner_id: string
          status: Database["public"]["Enums"]["engagement_status"]
          updated_at: string
        }
        Insert: {
          last_connection_at?: string | null
          last_progress_at?: string | null
          learner_id: string
          status?: Database["public"]["Enums"]["engagement_status"]
          updated_at?: string
        }
        Update: {
          last_connection_at?: string | null
          last_progress_at?: string | null
          learner_id?: string
          status?: Database["public"]["Enums"]["engagement_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_tracking_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          certified_at: string | null
          cgv_accepted: boolean
          cgv_accepted_at: string | null
          contract_signed: boolean
          contract_signed_at: string | null
          created_at: string
          enrolled_at: string | null
          formation_id: string
          id: string
          learner_id: string
          payment_confirmed_at: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          status: Database["public"]["Enums"]["student_status"]
          trial_ends_at: string | null
          trial_started_at: string | null
          updated_at: string
        }
        Insert: {
          certified_at?: string | null
          cgv_accepted?: boolean
          cgv_accepted_at?: string | null
          contract_signed?: boolean
          contract_signed_at?: string | null
          created_at?: string
          enrolled_at?: string | null
          formation_id: string
          id?: string
          learner_id: string
          payment_confirmed_at?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          status?: Database["public"]["Enums"]["student_status"]
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
        }
        Update: {
          certified_at?: string | null
          cgv_accepted?: boolean
          cgv_accepted_at?: string | null
          contract_signed?: boolean
          contract_signed_at?: string | null
          created_at?: string
          enrolled_at?: string | null
          formation_id?: string
          id?: string
          learner_id?: string
          payment_confirmed_at?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          status?: Database["public"]["Enums"]["student_status"]
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_attempts: {
        Row: {
          answers: Json
          attempt_number: number
          blocked_reason: string | null
          blocked_until: string | null
          completed_at: string
          exam_bloc_id: string | null
          exam_final_id: string | null
          exam_kind: Database["public"]["Enums"]["exam_kind"]
          id: string
          learner_id: string
          passed: boolean
          score: number
          started_at: string | null
        }
        Insert: {
          answers?: Json
          attempt_number: number
          blocked_reason?: string | null
          blocked_until?: string | null
          completed_at?: string
          exam_bloc_id?: string | null
          exam_final_id?: string | null
          exam_kind: Database["public"]["Enums"]["exam_kind"]
          id?: string
          learner_id: string
          passed: boolean
          score: number
          started_at?: string | null
        }
        Update: {
          answers?: Json
          attempt_number?: number
          blocked_reason?: string | null
          blocked_until?: string | null
          completed_at?: string
          exam_bloc_id?: string | null
          exam_final_id?: string | null
          exam_kind?: Database["public"]["Enums"]["exam_kind"]
          id?: string
          learner_id?: string
          passed?: boolean
          score?: number
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_exam_bloc_id_fkey"
            columns: ["exam_bloc_id"]
            isOneToOne: false
            referencedRelation: "exams_bloc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_attempts_exam_final_id_fkey"
            columns: ["exam_final_id"]
            isOneToOne: false
            referencedRelation: "exams_final"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_attempts_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exams_bloc: {
        Row: {
          bloc_id: string
          created_at: string
          id: string
          message_accueil: string
          message_attente: string
          message_reussite: string
          passing_score: number
          time_limit_minutes: number | null
          title: string
          updated_at: string
        }
        Insert: {
          bloc_id: string
          created_at?: string
          id?: string
          message_accueil: string
          message_attente: string
          message_reussite: string
          passing_score?: number
          time_limit_minutes?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          bloc_id?: string
          created_at?: string
          id?: string
          message_accueil?: string
          message_attente?: string
          message_reussite?: string
          passing_score?: number
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_bloc_bloc_id_fkey"
            columns: ["bloc_id"]
            isOneToOne: true
            referencedRelation: "blocs"
            referencedColumns: ["id"]
          },
        ]
      }
      exams_final: {
        Row: {
          created_at: string
          formation_id: string
          id: string
          message_accueil: string | null
          message_encouragement: string | null
          message_reussite: string | null
          passing_score: number
          time_limit_minutes: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          formation_id: string
          id?: string
          message_accueil?: string | null
          message_encouragement?: string | null
          message_reussite?: string | null
          passing_score?: number
          time_limit_minutes?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          formation_id?: string
          id?: string
          message_accueil?: string | null
          message_encouragement?: string | null
          message_reussite?: string | null
          passing_score?: number
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_final_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: true
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      final_exam_progress: {
        Row: {
          best_score: number | null
          completed_at: string | null
          exam_final_id: string
          id: string
          learner_id: string
          notes: string | null
          passed_at: string | null
          requested_at: string | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["final_exam_status"]
          updated_at: string
        }
        Insert: {
          best_score?: number | null
          completed_at?: string | null
          exam_final_id: string
          id?: string
          learner_id: string
          notes?: string | null
          passed_at?: string | null
          requested_at?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["final_exam_status"]
          updated_at?: string
        }
        Update: {
          best_score?: number | null
          completed_at?: string | null
          exam_final_id?: string
          id?: string
          learner_id?: string
          notes?: string | null
          passed_at?: string | null
          requested_at?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["final_exam_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "final_exam_progress_exam_final_id_fkey"
            columns: ["exam_final_id"]
            isOneToOne: false
            referencedRelation: "exams_final"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "final_exam_progress_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      formations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          lifecycle: Database["public"]["Enums"]["formation_lifecycle"]
          position: number
          requires_positioning: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          lifecycle?: Database["public"]["Enums"]["formation_lifecycle"]
          position?: number
          requires_positioning?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          lifecycle?: Database["public"]["Enums"]["formation_lifecycle"]
          position?: number
          requires_positioning?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          label: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      onboarding_results: {
        Row: {
          answers: Json
          completed_at: string
          id: string
          learner_id: string
          pnl_level: string
          questionnaire_version: number
          recommended_pace: string
        }
        Insert: {
          answers: Json
          completed_at?: string
          id?: string
          learner_id: string
          pnl_level: string
          questionnaire_version?: number
          recommended_pace: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          id?: string
          learner_id?: string
          pnl_level?: string
          questionnaire_version?: number
          recommended_pace?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_results_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount_cents: number
          currency: string
          enrollment_id: string | null
          id: string
          learner_id: string
          occurred_at: string
          status: Database["public"]["Enums"]["payment_txn_status"]
          stripe_payment_intent: string | null
        }
        Insert: {
          amount_cents: number
          currency?: string
          enrollment_id?: string | null
          id?: string
          learner_id: string
          occurred_at?: string
          status: Database["public"]["Enums"]["payment_txn_status"]
          stripe_payment_intent?: string | null
        }
        Update: {
          amount_cents?: number
          currency?: string
          enrollment_id?: string | null
          id?: string
          learner_id?: string
          occurred_at?: string
          status?: Database["public"]["Enums"]["payment_txn_status"]
          stripe_payment_intent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          exam_passing_score: number
          id: boolean
          maintenance_mode: boolean
          max_exam_attempts: number
          session_registration_deadline_days: number
          site_name: string
          support_email: string
          updated_at: string
        }
        Insert: {
          exam_passing_score?: number
          id?: boolean
          maintenance_mode?: boolean
          max_exam_attempts?: number
          session_registration_deadline_days?: number
          site_name: string
          support_email: string
          updated_at?: string
        }
        Update: {
          exam_passing_score?: number
          id?: boolean
          maintenance_mode?: boolean
          max_exam_attempts?: number
          session_registration_deadline_days?: number
          site_name?: string
          support_email?: string
          updated_at?: string
        }
        Relationships: []
      }
      positioning_results: {
        Row: {
          answers: Json
          completed_at: string
          formation_id: string
          id: string
          learner_id: string
          questionnaire_version: number
          recommendations: Json
          score: number | null
          starting_level: string
        }
        Insert: {
          answers: Json
          completed_at?: string
          formation_id: string
          id?: string
          learner_id: string
          questionnaire_version?: number
          recommendations?: Json
          score?: number | null
          starting_level: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          formation_id?: string
          id?: string
          learner_id?: string
          questionnaire_version?: number
          recommendations?: Json
          score?: number | null
          starting_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "positioning_results_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positioning_results_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_enrollment_answers: {
        Row: {
          answers: Json
          completed_at: string
          contact_email: string | null
          id: string
          learner_id: string | null
          questionnaire_version: number
        }
        Insert: {
          answers: Json
          completed_at?: string
          contact_email?: string | null
          id?: string
          learner_id?: string | null
          questionnaire_version?: number
        }
        Update: {
          answers?: Json
          completed_at?: string
          contact_email?: string | null
          id?: string
          learner_id?: string | null
          questionnaire_version?: number
        }
        Relationships: [
          {
            foreignKeyName: "pre_enrollment_answers_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      presentiel_sessions: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          formation_id: string | null
          id: string
          location: string
          max_participants: number
          session_date: string
          start_time: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          formation_id?: string | null
          id?: string
          location: string
          max_participants: number
          session_date: string
          start_time: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          formation_id?: string | null
          id?: string
          location?: string
          max_participants?: number
          session_date?: string
          start_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "presentiel_sessions_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          last_name: string
          must_change_password: boolean
          phone: string | null
          profession: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          is_active?: boolean
          last_login_at?: string | null
          last_name: string
          must_change_password?: boolean
          phone?: string | null
          profession?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          last_name?: string
          must_change_password?: boolean
          phone?: string | null
          profession?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      question_answers: {
        Row: {
          correct_answer: string | null
          explanation: string | null
          question_id: string
        }
        Insert: {
          correct_answer?: string | null
          explanation?: string | null
          question_id: string
        }
        Update: {
          correct_answer?: string | null
          explanation?: string | null
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_notions: {
        Row: {
          created_at: string
          notion_id: string
          question_id: string
        }
        Insert: {
          created_at?: string
          notion_id: string
          question_id: string
        }
        Update: {
          created_at?: string
          notion_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_notions_notion_id_fkey"
            columns: ["notion_id"]
            isOneToOne: false
            referencedRelation: "notion_responses_by_learner"
            referencedColumns: ["notion_id"]
          },
          {
            foreignKeyName: "question_notions_notion_id_fkey"
            columns: ["notion_id"]
            isOneToOne: false
            referencedRelation: "notion_responses_global"
            referencedColumns: ["notion_id"]
          },
          {
            foreignKeyName: "question_notions_notion_id_fkey"
            columns: ["notion_id"]
            isOneToOne: false
            referencedRelation: "notions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_notions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_responses: {
        Row: {
          answer: string
          answered_at: string
          attempt_count: number
          id: string
          is_correct: boolean | null
          learner_id: string
          occurrence: number
          question_id: string
          response_time_ms: number | null
          review_status: Database["public"]["Enums"]["submission_status"] | null
          reviewed_at: string | null
          reviewer_feedback: string | null
          reviewer_id: string | null
        }
        Insert: {
          answer: string
          answered_at?: string
          attempt_count?: number
          id?: string
          is_correct?: boolean | null
          learner_id: string
          occurrence?: number
          question_id: string
          response_time_ms?: number | null
          review_status?:
            | Database["public"]["Enums"]["submission_status"]
            | null
          reviewed_at?: string | null
          reviewer_feedback?: string | null
          reviewer_id?: string | null
        }
        Update: {
          answer?: string
          answered_at?: string
          attempt_count?: number
          id?: string
          is_correct?: boolean | null
          learner_id?: string
          occurrence?: number
          question_id?: string
          response_time_ms?: number | null
          review_status?:
            | Database["public"]["Enums"]["submission_status"]
            | null
          reviewed_at?: string | null
          reviewer_feedback?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_responses_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_responses_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          content: string
          created_at: string
          exam_bloc_id: string | null
          exam_final_id: string | null
          id: string
          is_blocking: boolean
          is_qcm: boolean
          item_id: string | null
          options: Json | null
          points: number
          position: number
          requires_human_review: boolean
          scope: Database["public"]["Enums"]["question_scope"]
          type: Database["public"]["Enums"]["question_type"]
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          exam_bloc_id?: string | null
          exam_final_id?: string | null
          id?: string
          is_blocking?: boolean
          is_qcm?: boolean
          item_id?: string | null
          options?: Json | null
          points?: number
          position?: number
          requires_human_review?: boolean
          scope?: Database["public"]["Enums"]["question_scope"]
          type: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          exam_bloc_id?: string | null
          exam_final_id?: string | null
          id?: string
          is_blocking?: boolean
          is_qcm?: boolean
          item_id?: string | null
          options?: Json | null
          points?: number
          position?: number
          requires_human_review?: boolean
          scope?: Database["public"]["Enums"]["question_scope"]
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_exam_bloc_fk"
            columns: ["exam_bloc_id"]
            isOneToOne: false
            referencedRelation: "exams_bloc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_exam_final_fk"
            columns: ["exam_final_id"]
            isOneToOne: false
            referencedRelation: "exams_final"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "course_items"
            referencedColumns: ["id"]
          },
        ]
      }
      revision_resources: {
        Row: {
          answer: string | null
          bloc_id: string | null
          content: string
          created_at: string
          description: string | null
          id: string
          title: string
          type: Database["public"]["Enums"]["revision_resource_type"]
        }
        Insert: {
          answer?: string | null
          bloc_id?: string | null
          content: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
          type: Database["public"]["Enums"]["revision_resource_type"]
        }
        Update: {
          answer?: string | null
          bloc_id?: string | null
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          type?: Database["public"]["Enums"]["revision_resource_type"]
        }
        Relationships: [
          {
            foreignKeyName: "revision_resources_bloc_id_fkey"
            columns: ["bloc_id"]
            isOneToOne: false
            referencedRelation: "blocs"
            referencedColumns: ["id"]
          },
        ]
      }
      satisfaction_surveys: {
        Row: {
          access_token: string | null
          answers: Json
          completed_at: string | null
          created_at: string
          formation_id: string
          id: string
          is_published: boolean
          learner_id: string | null
          public_review: string | null
          type: Database["public"]["Enums"]["satisfaction_type"]
          wants_public_review: boolean
        }
        Insert: {
          access_token?: string | null
          answers?: Json
          completed_at?: string | null
          created_at?: string
          formation_id: string
          id?: string
          is_published?: boolean
          learner_id?: string | null
          public_review?: string | null
          type: Database["public"]["Enums"]["satisfaction_type"]
          wants_public_review?: boolean
        }
        Update: {
          access_token?: string | null
          answers?: Json
          completed_at?: string | null
          created_at?: string
          formation_id?: string
          id?: string
          is_published?: boolean
          learner_id?: string | null
          public_review?: string | null
          type?: Database["public"]["Enums"]["satisfaction_type"]
          wants_public_review?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "satisfaction_surveys_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "satisfaction_surveys_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_reviews: {
        Row: {
          completed_at: string | null
          created_at: string
          due_on: string
          id: string
          interval_days: number
          is_correct: boolean | null
          learner_id: string
          question_id: string
          response_time_ms: number | null
          review_cycle_id: string
          status: Database["public"]["Enums"]["review_status"]
          student_answer: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_on: string
          id?: string
          interval_days: number
          is_correct?: boolean | null
          learner_id: string
          question_id: string
          response_time_ms?: number | null
          review_cycle_id: string
          status?: Database["public"]["Enums"]["review_status"]
          student_answer?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_on?: string
          id?: string
          interval_days?: number
          is_correct?: boolean | null
          learner_id?: string
          question_id?: string
          response_time_ms?: number | null
          review_cycle_id?: string
          status?: Database["public"]["Enums"]["review_status"]
          student_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reviews_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_reviews_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_registrations: {
        Row: {
          attended: boolean | null
          id: string
          learner_id: string
          registered_at: string
          session_id: string
        }
        Insert: {
          attended?: boolean | null
          id?: string
          learner_id: string
          registered_at?: string
          session_id: string
        }
        Update: {
          attended?: boolean | null
          id?: string
          learner_id?: string
          registered_at?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_registrations_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_registrations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "presentiel_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      site_collections: {
        Row: {
          created_at: string
          data: Json
          id: string
          position: number
          published: boolean
          slug: string | null
          type: Database["public"]["Enums"]["site_collection_type"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          position?: number
          published?: boolean
          slug?: string | null
          type: Database["public"]["Enums"]["site_collection_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          position?: number
          published?: boolean
          slug?: string | null
          type?: Database["public"]["Enums"]["site_collection_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_collections_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          group_name: string
          key: string
          label: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          group_name?: string
          key: string
          label: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          group_name?: string
          key?: string
          label?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content_versions: {
        Row: {
          changed_at: string
          changed_by: string | null
          entity: string
          entity_key: string
          id: string
          snapshot: Json
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          entity: string
          entity_key: string
          id?: string
          snapshot: Json
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          entity?: string
          entity_key?: string
          id?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_content_versions_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_media: {
        Row: {
          alt: string | null
          bucket: string | null
          bytes: number | null
          created_at: string
          height: number | null
          id: string
          kind: Database["public"]["Enums"]["site_media_kind"]
          mime: string | null
          path: string | null
          title: string | null
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt?: string | null
          bucket?: string | null
          bytes?: number | null
          created_at?: string
          height?: number | null
          id?: string
          kind: Database["public"]["Enums"]["site_media_kind"]
          mime?: string | null
          path?: string | null
          title?: string | null
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt?: string | null
          bucket?: string | null
          bytes?: number | null
          created_at?: string
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["site_media_kind"]
          mime?: string | null
          path?: string | null
          title?: string | null
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "site_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          created_at: string
          id: string
          learner_id: string
          message: string
          replied_at: string | null
          reply: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          id?: string
          learner_id: string
          message: string
          replied_at?: string | null
          reply?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          id?: string
          learner_id?: string
          message?: string
          replied_at?: string | null
          reply?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_documents: {
        Row: {
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          learner_id: string
          title: string
          type: Database["public"]["Enums"]["document_type"]
          uploaded_at: string
          uploaded_by: Database["public"]["Enums"]["upload_source"]
        }
        Insert: {
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          learner_id: string
          title: string
          type: Database["public"]["Enums"]["document_type"]
          uploaded_at?: string
          uploaded_by?: Database["public"]["Enums"]["upload_source"]
        }
        Update: {
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          learner_id?: string
          title?: string
          type?: Database["public"]["Enums"]["document_type"]
          uploaded_at?: string
          uploaded_by?: Database["public"]["Enums"]["upload_source"]
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vault_documents: {
        Row: {
          available_from: Database["public"]["Enums"]["student_status"] | null
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          file_url: string | null
          formation_id: string
          id: string
          signature_required: boolean
          title: string
          unlock_rule: Database["public"]["Enums"]["unlock_rule"]
          updated_at: string
          visible_when_locked: boolean
        }
        Insert: {
          available_from?: Database["public"]["Enums"]["student_status"] | null
          category: Database["public"]["Enums"]["document_category"]
          created_at?: string
          file_url?: string | null
          formation_id: string
          id?: string
          signature_required?: boolean
          title: string
          unlock_rule?: Database["public"]["Enums"]["unlock_rule"]
          updated_at?: string
          visible_when_locked?: boolean
        }
        Update: {
          available_from?: Database["public"]["Enums"]["student_status"] | null
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          file_url?: string | null
          formation_id?: string
          id?: string
          signature_required?: boolean
          title?: string
          unlock_rule?: Database["public"]["Enums"]["unlock_rule"]
          updated_at?: string
          visible_when_locked?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "vault_documents_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      vault_signatures: {
        Row: {
          id: string
          learner_id: string
          signature_meta: Json | null
          signed_at: string
          vault_document_id: string
        }
        Insert: {
          id?: string
          learner_id: string
          signature_meta?: Json | null
          signed_at?: string
          vault_document_id: string
        }
        Update: {
          id?: string
          learner_id?: string
          signature_meta?: Json | null
          signed_at?: string
          vault_document_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vault_signatures_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vault_signatures_vault_document_id_fkey"
            columns: ["vault_document_id"]
            isOneToOne: false
            referencedRelation: "learner_vault_view"
            referencedColumns: ["vault_document_id"]
          },
          {
            foreignKeyName: "vault_signatures_vault_document_id_fkey"
            columns: ["vault_document_id"]
            isOneToOne: false
            referencedRelation: "vault_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      vault_unlocks: {
        Row: {
          id: string
          learner_id: string
          trigger_kind: Database["public"]["Enums"]["unlock_trigger"]
          trigger_ref: string | null
          unlocked_at: string
          vault_document_id: string
        }
        Insert: {
          id?: string
          learner_id: string
          trigger_kind: Database["public"]["Enums"]["unlock_trigger"]
          trigger_ref?: string | null
          unlocked_at?: string
          vault_document_id: string
        }
        Update: {
          id?: string
          learner_id?: string
          trigger_kind?: Database["public"]["Enums"]["unlock_trigger"]
          trigger_ref?: string | null
          unlocked_at?: string
          vault_document_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vault_unlocks_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vault_unlocks_vault_document_id_fkey"
            columns: ["vault_document_id"]
            isOneToOne: false
            referencedRelation: "learner_vault_view"
            referencedColumns: ["vault_document_id"]
          },
          {
            foreignKeyName: "vault_unlocks_vault_document_id_fkey"
            columns: ["vault_document_id"]
            isOneToOne: false
            referencedRelation: "vault_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      video_notions: {
        Row: {
          created_at: string
          notion_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          notion_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          notion_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_notions_notion_id_fkey"
            columns: ["notion_id"]
            isOneToOne: false
            referencedRelation: "notion_responses_by_learner"
            referencedColumns: ["notion_id"]
          },
          {
            foreignKeyName: "video_notions_notion_id_fkey"
            columns: ["notion_id"]
            isOneToOne: false
            referencedRelation: "notion_responses_global"
            referencedColumns: ["notion_id"]
          },
          {
            foreignKeyName: "video_notions_notion_id_fkey"
            columns: ["notion_id"]
            isOneToOne: false
            referencedRelation: "notions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_notions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_overlay_answers: {
        Row: {
          correct_answer: string | null
          explanation: string | null
          overlay_question_id: string
        }
        Insert: {
          correct_answer?: string | null
          explanation?: string | null
          overlay_question_id: string
        }
        Update: {
          correct_answer?: string | null
          explanation?: string | null
          overlay_question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_overlay_answers_overlay_question_id_fkey"
            columns: ["overlay_question_id"]
            isOneToOne: true
            referencedRelation: "video_overlay_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      video_overlay_questions: {
        Row: {
          created_at: string
          format: Database["public"]["Enums"]["question_format"]
          id: string
          options: Json | null
          position: number
          question: string
          timestamp_seconds: number
          video_id: string
        }
        Insert: {
          created_at?: string
          format: Database["public"]["Enums"]["question_format"]
          id?: string
          options?: Json | null
          position?: number
          question: string
          timestamp_seconds: number
          video_id: string
        }
        Update: {
          created_at?: string
          format?: Database["public"]["Enums"]["question_format"]
          id?: string
          options?: Json | null
          position?: number
          question?: string
          timestamp_seconds?: number
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_overlay_questions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          last_position_seconds: number
          learner_id: string
          overlay_questions_answered: Json
          updated_at: string
          video_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          last_position_seconds?: number
          learner_id: string
          overlay_questions_answered?: Json
          updated_at?: string
          video_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          last_position_seconds?: number
          learner_id?: string
          overlay_questions_answered?: Json
          updated_at?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_reports: {
        Row: {
          created_at: string
          description: string
          id: string
          learner_id: string
          page_url: string | null
          report_type: Database["public"]["Enums"]["report_type"]
          resolution_notes: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["report_status"]
          video_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          learner_id: string
          page_url?: string | null
          report_type?: Database["public"]["Enums"]["report_type"]
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          video_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          learner_id?: string
          page_url?: string | null
          report_type?: Database["public"]["Enums"]["report_type"]
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_reports_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_reports_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          announces_vault: boolean
          code: string
          created_at: string
          description: string | null
          duration_seconds: number
          id: string
          is_published: boolean
          item_id: string
          src: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          announces_vault?: boolean
          code: string
          created_at?: string
          description?: string | null
          duration_seconds?: number
          id?: string
          is_published?: boolean
          item_id: string
          src?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          announces_vault?: boolean
          code?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number
          id?: string
          is_published?: boolean
          item_id?: string
          src?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "course_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      engagement_overview: {
        Row: {
          days_since_last_activity: number | null
          days_since_last_connection: number | null
          email: string | null
          first_name: string | null
          last_connection_at: string | null
          last_name: string | null
          last_progress_at: string | null
          learner_id: string | null
          status: Database["public"]["Enums"]["engagement_status"] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_tracking_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      export_ind12_engagement: {
        Row: {
          days_since_last_activity: number | null
          email: string | null
          engagement_status:
            | Database["public"]["Enums"]["engagement_status"]
            | null
          first_name: string | null
          last_connection_at: string | null
          last_name: string | null
          last_progress_at: string | null
          learner_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_tracking_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      export_ind2_resultats: {
        Row: {
          attempt_id: string | null
          attempt_number: number | null
          completed_at: string | null
          email: string | null
          exam_bloc_title: string | null
          exam_final_title: string | null
          exam_kind: Database["public"]["Enums"]["exam_kind"] | null
          first_name: string | null
          last_name: string | null
          learner_id: string | null
          passed: boolean | null
          score: number | null
          started_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      export_ind30_satisfaction: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          formation_id: string | null
          formation_title: string | null
          is_published: boolean | null
          last_name: string | null
          learner_id: string | null
          public_review: string | null
          survey_id: string | null
          survey_type: Database["public"]["Enums"]["satisfaction_type"] | null
          wants_public_review: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "satisfaction_surveys_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "satisfaction_surveys_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      export_ind31_signalements: {
        Row: {
          created_at: string | null
          description: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          learner_id: string | null
          page_url: string | null
          report_id: string | null
          report_type: Database["public"]["Enums"]["report_type"] | null
          resolution_notes: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          video_id: string | null
          video_title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_reports_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_reports_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      export_ind4_preinscription: {
        Row: {
          answers: Json | null
          completed_at: string | null
          contact_email: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          learner_id: string | null
          pre_enrollment_id: string | null
          questionnaire_version: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pre_enrollment_answers_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      export_ind8_positionnement: {
        Row: {
          answers: Json | null
          completed_at: string | null
          email: string | null
          first_name: string | null
          formation_id: string | null
          formation_title: string | null
          last_name: string | null
          learner_id: string | null
          positioning_id: string | null
          questionnaire_version: number | null
          recommendations: Json | null
          score: number | null
          starting_level: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positioning_results_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positioning_results_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_progress_view: {
        Row: {
          blocs_avec_progres: number | null
          blocs_completes: number | null
          blocs_valides: number | null
          certified_at: string | null
          cours_avec_progres: number | null
          cours_completes: number | null
          cours_en_cours: number | null
          email: string | null
          enrolled_at: string | null
          enrollment_status:
            | Database["public"]["Enums"]["student_status"]
            | null
          first_name: string | null
          formation_id: string | null
          formation_title: string | null
          last_name: string | null
          learner_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_vault_view: {
        Row: {
          available_from: Database["public"]["Enums"]["student_status"] | null
          category: Database["public"]["Enums"]["document_category"] | null
          enrollment_status:
            | Database["public"]["Enums"]["student_status"]
            | null
          file_url: string | null
          formation_id: string | null
          has_explicit_unlock: boolean | null
          is_unlocked: boolean | null
          is_visible: boolean | null
          learner_id: string | null
          signature_required: boolean | null
          title: string | null
          unlock_rule: Database["public"]["Enums"]["unlock_rule"] | null
          unlocked_at: string | null
          vault_document_id: string | null
          visible_when_locked: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notion_responses_by_learner: {
        Row: {
          correct_rate_pct: number | null
          correct_responses: number | null
          incorrect_responses: number | null
          learner_id: string | null
          notion_id: string | null
          notion_label: string | null
          pending_responses: number | null
          total_responses: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_responses_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notion_responses_global: {
        Row: {
          correct_rate_pct: number | null
          correct_responses: number | null
          incorrect_responses: number | null
          notion_id: string | null
          notion_label: string | null
          pending_responses: number | null
          total_responses: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      complete_review: {
        Args: {
          p_answer: string
          p_response_time_ms?: number
          p_review_id: string
        }
        Returns: Json
      }
      get_cours_questions: { Args: { p_cours_id: string }; Returns: Json[] }
      get_satisfaction_survey_by_token: {
        Args: { p_token: string }
        Returns: Json
      }
      is_staff:
        | { Args: never; Returns: boolean }
        | { Args: { uid: string }; Returns: boolean }
      next_final_delay: { Args: { attempt_index: number }; Returns: string }
      record_video_progress: {
        Args: { p_completed: boolean; p_position: number; p_video_id: string }
        Returns: Json
      }
      reorder_course_item: {
        Args: { p_item_id: string; p_new_position: number }
        Returns: Json
      }
      submit_exam_attempt: {
        Args: {
          p_answers: Json
          p_exam_id: string
          p_exam_kind: Database["public"]["Enums"]["exam_kind"]
        }
        Returns: Json
      }
      submit_question_response: {
        Args: {
          p_answer: string
          p_question_id: string
          p_response_time_ms?: number
        }
        Returns: Json
      }
      submit_satisfaction_survey_by_token: {
        Args: {
          p_answers: Json
          p_public_review?: string
          p_token: string
          p_wants_public_review?: boolean
        }
        Returns: Json
      }
      update_engagement_status: {
        Args: {
          p_last_progress_at?: string
          p_learner: string
          p_status: Database["public"]["Enums"]["engagement_status"]
        }
        Returns: undefined
      }
    }
    Enums: {
      access_level: "all" | "valide" | "certifie"
      access_tier: "decouverte" | "inscrit" | "certifie"
      app_role: "eleve" | "admin" | "formateur"
      chat_role: "user" | "assistant"
      course_item_kind: "video" | "question" | "acces_coffre" | "fin_cours"
      document_category:
        | "contractuels"
        | "financiers"
        | "pedagogiques"
        | "qualite"
        | "pratiques"
      document_type: "facture" | "contrat" | "attestation" | "autre"
      engagement_status:
        | "actif"
        | "inactif_7j"
        | "inactif_14j"
        | "inactif_28j"
        | "inactif_42j"
        | "abandonne"
      exam_kind: "bloc" | "final"
      final_exam_status:
        | "not_started"
        | "requested"
        | "scheduled"
        | "passed"
        | "failed"
        | "practical_case_open"
        | "practical_case_passed"
        | "practical_case_failed"
      formation_lifecycle: "available" | "creation" | "projet"
      payment_status: "trial" | "active" | "failed" | "cancelled"
      payment_txn_status: "pending" | "succeeded" | "failed" | "refunded"
      progress_status: "not_started" | "in_progress" | "completed"
      question_format: "qcm" | "vrai_faux" | "texte"
      question_scope: "cours" | "examen_bloc" | "examen_final"
      question_type:
        | "philosophique"
        | "anticipative"
        | "validation"
        | "integration"
      reminder_channel: "email" | "call"
      report_status: "ouvert" | "en_cours" | "resolu"
      report_type: "bug" | "incoherence"
      review_status: "pending" | "done" | "superseded"
      revision_resource_type: "pdf" | "question" | "video"
      satisfaction_type: "chaud" | "froid"
      site_collection_type:
        | "formations"
        | "modules_pnl"
        | "faq"
        | "sections_concept"
        | "sections_vocation"
        | "parcours_steps"
        | "team_bios"
        | "contact_blocks"
        | "accessibilite_procedure"
        | "accessibilite_reseau"
      site_media_kind: "image" | "video_link" | "document"
      student_status: "decouverte" | "inscrit" | "bloque" | "certifie"
      submission_status: "pending" | "corrected"
      unlock_rule: "status" | "progressive" | "always"
      unlock_trigger:
        | "video_completion"
        | "question_correct"
        | "exam_passed"
        | "status_change"
        | "manual"
      upload_source: "admin" | "system"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_level: ["all", "valide", "certifie"],
      access_tier: ["decouverte", "inscrit", "certifie"],
      app_role: ["eleve", "admin", "formateur"],
      chat_role: ["user", "assistant"],
      course_item_kind: ["video", "question", "acces_coffre", "fin_cours"],
      document_category: [
        "contractuels",
        "financiers",
        "pedagogiques",
        "qualite",
        "pratiques",
      ],
      document_type: ["facture", "contrat", "attestation", "autre"],
      engagement_status: [
        "actif",
        "inactif_7j",
        "inactif_14j",
        "inactif_28j",
        "inactif_42j",
        "abandonne",
      ],
      exam_kind: ["bloc", "final"],
      final_exam_status: [
        "not_started",
        "requested",
        "scheduled",
        "passed",
        "failed",
        "practical_case_open",
        "practical_case_passed",
        "practical_case_failed",
      ],
      formation_lifecycle: ["available", "creation", "projet"],
      payment_status: ["trial", "active", "failed", "cancelled"],
      payment_txn_status: ["pending", "succeeded", "failed", "refunded"],
      progress_status: ["not_started", "in_progress", "completed"],
      question_format: ["qcm", "vrai_faux", "texte"],
      question_scope: ["cours", "examen_bloc", "examen_final"],
      question_type: [
        "philosophique",
        "anticipative",
        "validation",
        "integration",
      ],
      reminder_channel: ["email", "call"],
      report_status: ["ouvert", "en_cours", "resolu"],
      report_type: ["bug", "incoherence"],
      review_status: ["pending", "done", "superseded"],
      revision_resource_type: ["pdf", "question", "video"],
      satisfaction_type: ["chaud", "froid"],
      site_collection_type: [
        "formations",
        "modules_pnl",
        "faq",
        "sections_concept",
        "sections_vocation",
        "parcours_steps",
        "team_bios",
        "contact_blocks",
        "accessibilite_procedure",
        "accessibilite_reseau",
      ],
      site_media_kind: ["image", "video_link", "document"],
      student_status: ["decouverte", "inscrit", "bloque", "certifie"],
      submission_status: ["pending", "corrected"],
      unlock_rule: ["status", "progressive", "always"],
      unlock_trigger: [
        "video_completion",
        "question_correct",
        "exam_passed",
        "status_change",
        "manual",
      ],
      upload_source: ["admin", "system"],
    },
  },
} as const
