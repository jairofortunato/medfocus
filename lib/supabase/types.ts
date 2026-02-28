// Generated database types for Supabase
// Run `npx supabase gen types typescript` to regenerate from live schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      exams: {
        Row: {
          id: string;
          slug: string;
          nome: string;
          ano: number;
          total_questoes: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          nome: string;
          ano: number;
          total_questoes: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          nome?: string;
          ano?: number;
          total_questoes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          nome: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          slug?: string;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          exam_id: string;
          numero: number;
          enunciado: string;
          alternativa_a: string;
          alternativa_b: string;
          alternativa_c: string;
          alternativa_d: string;
          alternativa_e: string;
          resposta_correta: string;
          explicacao: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          numero: number;
          enunciado: string;
          alternativa_a: string;
          alternativa_b: string;
          alternativa_c: string;
          alternativa_d: string;
          alternativa_e: string;
          resposta_correta: string;
          explicacao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          exam_id?: string;
          numero?: number;
          enunciado?: string;
          alternativa_a?: string;
          alternativa_b?: string;
          alternativa_c?: string;
          alternativa_d?: string;
          alternativa_e?: string;
          resposta_correta?: string;
          explicacao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      question_tags: {
        Row: {
          question_id: string;
          tag_id: string;
        };
        Insert: {
          question_id: string;
          tag_id: string;
        };
        Update: {
          question_id?: string;
          tag_id?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_answers: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          selected_answer: string;
          is_correct: boolean;
          time_spent_ms: number | null;
          session_id: string | null;
          answered_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          selected_answer: string;
          is_correct: boolean;
          time_spent_ms?: number | null;
          session_id?: string | null;
          answered_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          selected_answer?: string;
          is_correct?: boolean;
          time_spent_ms?: number | null;
          session_id?: string | null;
          answered_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string;
          started_at: string;
          ended_at: string | null;
          planned_duration_secs: number;
          actual_duration_secs: number | null;
          session_type: string;
          questions_answered: number;
          questions_correct: number;
          completed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_id: string;
          started_at?: string;
          ended_at?: string | null;
          planned_duration_secs?: number;
          actual_duration_secs?: number | null;
          session_type?: string;
          questions_answered?: number;
          questions_correct?: number;
          completed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_id?: string;
          started_at?: string;
          ended_at?: string | null;
          planned_duration_secs?: number;
          actual_duration_secs?: number | null;
          session_type?: string;
          questions_answered?: number;
          questions_correct?: number;
          completed?: boolean;
        };
      };
      user_exam_progress: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string;
          current_question_numero: number;
          last_accessed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_id: string;
          current_question_numero?: number;
          last_accessed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_id?: string;
          current_question_numero?: number;
          last_accessed_at?: string;
        };
      };
    };
    Functions: {
      get_tag_statistics: {
        Args: {
          p_user_id: string;
          p_exam_id: string;
        };
        Returns: {
          tag_name: string;
          tag_slug: string;
          total: number;
          answered: number;
          correct: number;
          percentage: number;
        }[];
      };
      get_study_streak: {
        Args: {
          p_user_id: string;
        };
        Returns: number;
      };
    };
  };
}

// Convenience type aliases
export type Exam = Database['public']['Tables']['exams']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type DbQuestion = Database['public']['Tables']['questions']['Row'];
export type QuestionTag = Database['public']['Tables']['question_tags']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserAnswer = Database['public']['Tables']['user_answers']['Row'];
export type StudySession = Database['public']['Tables']['study_sessions']['Row'];
export type UserExamProgress = Database['public']['Tables']['user_exam_progress']['Row'];
