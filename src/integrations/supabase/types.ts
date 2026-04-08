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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      answers: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_correct: boolean | null
          question_id: string
          result_id: string | null
          sort_order: number
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_correct?: boolean | null
          question_id: string
          result_id?: string | null
          sort_order?: number
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_correct?: boolean | null
          question_id?: string
          result_id?: string | null
          sort_order?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "results"
            referencedColumns: ["id"]
          },
        ]
      }
      buzz_chat_replies: {
        Row: {
          buzz_chat_id: string
          created_at: string
          id: string
          reply_text: string
        }
        Insert: {
          buzz_chat_id: string
          created_at?: string
          id?: string
          reply_text: string
        }
        Update: {
          buzz_chat_id?: string
          created_at?: string
          id?: string
          reply_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "buzz_chat_replies_buzz_chat_id_fkey"
            columns: ["buzz_chat_id"]
            isOneToOne: false
            referencedRelation: "buzz_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      buzz_chats: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          question: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          question: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          question?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_name: string
          comment_text: string
          content_id: string
          content_type: string
          created_at: string
          id: string
        }
        Insert: {
          author_name: string
          comment_text: string
          content_id: string
          content_type: string
          created_at?: string
          id?: string
        }
        Update: {
          author_name?: string
          comment_text?: string
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      email_captures: {
        Row: {
          captured_at: string | null
          email: string
          id: string
          quiz_id: string | null
          quiz_title: string | null
          result_title: string | null
          tags: string[] | null
        }
        Insert: {
          captured_at?: string | null
          email: string
          id?: string
          quiz_id?: string | null
          quiz_title?: string | null
          result_title?: string | null
          tags?: string[] | null
        }
        Update: {
          captured_at?: string | null
          email?: string
          id?: string
          quiz_id?: string | null
          quiz_title?: string | null
          result_title?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "email_captures_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          count: number
          emoji: string
          id: string
          post_id: string
        }
        Insert: {
          count?: number
          emoji: string
          id?: string
          post_id: string
        }
        Update: {
          count?: number
          emoji?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category_id: string | null
          content: string | null
          created_at: string
          description: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          is_published: boolean
          is_trending: boolean
          llm_summary: string | null
          meta_description: string | null
          meta_title: string | null
          post_type: Database["public"]["Enums"]["post_type"]
          primary_keyword: string | null
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_published?: boolean
          is_trending?: boolean
          llm_summary?: string | null
          meta_description?: string | null
          meta_title?: string | null
          post_type?: Database["public"]["Enums"]["post_type"]
          primary_keyword?: string | null
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          category_id?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_published?: boolean
          is_trending?: boolean
          llm_summary?: string | null
          meta_description?: string | null
          meta_title?: string | null
          post_type?: Database["public"]["Enums"]["post_type"]
          primary_keyword?: string | null
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          name: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          quiz_id: string
          sort_order: number
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          quiz_id: string
          sort_order?: number
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          quiz_id?: string
          sort_order?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          completed_at: string
          id: string
          quiz_id: string
          result_id: string | null
          score: number | null
        }
        Insert: {
          completed_at?: string
          id?: string
          quiz_id: string
          result_id?: string | null
          score?: number | null
        }
        Update: {
          completed_at?: string
          id?: string
          quiz_id?: string
          result_id?: string | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "results"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          author_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          instructions: string | null
          is_published: boolean
          is_trending: boolean
          plays_count: number
          slug: string | null
          title: string
          type: Database["public"]["Enums"]["quiz_type"]
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_published?: boolean
          is_trending?: boolean
          plays_count?: number
          slug?: string | null
          title: string
          type?: Database["public"]["Enums"]["quiz_type"]
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_published?: boolean
          is_trending?: boolean
          plays_count?: number
          slug?: string | null
          title?: string
          type?: Database["public"]["Enums"]["quiz_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          quiz_id: string
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          quiz_id: string
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          quiz_id?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_plays: { Args: { quiz_id_param: string }; Returns: undefined }
      increment_views: { Args: { post_id_param: string }; Returns: undefined }
      upsert_reaction: {
        Args: { p_emoji: string; p_post_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator"
      post_type: "article" | "shopping" | "celebrity" | "trending_news"
      quiz_type: "personality" | "trivia"
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
      app_role: ["admin", "moderator"],
      post_type: ["article", "shopping", "celebrity", "trending_news"],
      quiz_type: ["personality", "trivia"],
    },
  },
} as const
