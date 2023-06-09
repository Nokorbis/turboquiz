export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      game: {
        Row: {
          access_key: string
          game_date: string
          id: number
          name: string | null
        }
        Insert: {
          access_key?: string
          game_date: string
          id?: number
          name?: string | null
        }
        Update: {
          access_key?: string
          game_date?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      game_player: {
        Row: {
          game_key: string
          id: number
          score: number
          user_id: string
        }
        Insert: {
          game_key: string
          id?: number
          score?: number
          user_id: string
        }
        Update: {
          game_key?: string
          id?: number
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_player_game_key_fkey"
            columns: ["game_key"]
            referencedRelation: "game"
            referencedColumns: ["access_key"]
          },
          {
            foreignKeyName: "game_player_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          }
        ]
      }
      grid_game: {
        Row: {
          id: number
          points_theme_others: number
          points_theme_self: number
        }
        Insert: {
          id?: number
          points_theme_others?: number
          points_theme_self?: number
        }
        Update: {
          id?: number
          points_theme_others?: number
          points_theme_self?: number
        }
        Relationships: [
          {
            foreignKeyName: "grid_game_id_fkey"
            columns: ["id"]
            referencedRelation: "game"
            referencedColumns: ["id"]
          }
        ]
      }
      grid_question: {
        Row: {
          answer: string
          id: number
          points_value: number
          statement: string
          theme_id: number
        }
        Insert: {
          answer: string
          id?: number
          points_value?: number
          statement: string
          theme_id: number
        }
        Update: {
          answer?: string
          id?: number
          points_value?: number
          statement?: string
          theme_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "grid_question_theme_id_fkey"
            columns: ["theme_id"]
            referencedRelation: "grid_theme"
            referencedColumns: ["id"]
          }
        ]
      }
      grid_theme: {
        Row: {
          color: string
          game_id: number
          id: number
          name: string
          owner_id: string | null
        }
        Insert: {
          color: string
          game_id: number
          id?: number
          name: string
          owner_id?: string | null
        }
        Update: {
          color?: string
          game_id?: number
          id?: number
          name?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grid_theme_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grid_theme_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          }
        ]
      }
      profile: {
        Row: {
          culture_level: number
          display_name: string
          has_microphone: boolean
          profile_picture: string
          themes: string
          user_id: string
          wants_to_play: boolean
        }
        Insert: {
          culture_level?: number
          display_name: string
          has_microphone?: boolean
          profile_picture: string
          themes?: string
          user_id: string
          wants_to_play?: boolean
        }
        Update: {
          culture_level?: number
          display_name?: string
          has_microphone?: boolean
          profile_picture?: string
          themes?: string
          user_id?: string
          wants_to_play?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      running_game: {
        Row: {
          id: number
          initiative_value: number
          players: Json | null
          state: Json | null
        }
        Insert: {
          id?: number
          initiative_value?: number
          players?: Json | null
          state?: Json | null
        }
        Update: {
          id?: number
          initiative_value?: number
          players?: Json | null
          state?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "running_game_id_fkey"
            columns: ["id"]
            referencedRelation: "game"
            referencedColumns: ["id"]
          }
        ]
      }
      timed_question: {
        Row: {
          answer: string
          id: number
          points_value: number
          statement: string
          theme_id: number
        }
        Insert: {
          answer: string
          id?: number
          points_value: number
          statement: string
          theme_id: number
        }
        Update: {
          answer?: string
          id?: number
          points_value?: number
          statement?: string
          theme_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "timed_question_theme_id_fkey"
            columns: ["theme_id"]
            referencedRelation: "timed_theme"
            referencedColumns: ["id"]
          }
        ]
      }
      timed_theme: {
        Row: {
          game_id: number
          id: number
          is_mystery: boolean
          name: string
        }
        Insert: {
          game_id: number
          id?: number
          is_mystery: boolean
          name: string
        }
        Update: {
          game_id?: number
          id?: number
          is_mystery?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "timed_theme_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "game"
            referencedColumns: ["id"]
          }
        ]
      }
      user_permission: {
        Row: {
          is_animator: boolean
          user_id: string
        }
        Insert: {
          is_animator?: boolean
          user_id: string
        }
        Update: {
          is_animator?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permission_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      v_themes_by_players: {
        Row: {
          color: string | null
          display_name: string | null
          game_key: string | null
          game_player_id: number | null
          name: string | null
          profile_picture: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_player_game_key_fkey"
            columns: ["game_key"]
            referencedRelation: "game"
            referencedColumns: ["access_key"]
          },
          {
            foreignKeyName: "game_player_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          }
        ]
      }
    }
    Functions: {
      is_animator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
