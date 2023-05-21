export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
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
      }
    }
    Views: {
      [_ in never]: never
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
