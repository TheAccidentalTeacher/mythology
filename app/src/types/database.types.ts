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
      profiles: {
        Row: {
          id: string
          email: string
          role: 'student' | 'teacher' | 'admin'
          display_name: string
          avatar_url: string | null
          school_name: string | null
          grade_level: string | null
          classroom_id: string | null
          points: number
          level: number
          current_streak: number
          longest_streak: number
          last_activity_date: string
          preferred_theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'student' | 'teacher' | 'admin'
          display_name: string
          avatar_url?: string | null
          school_name?: string | null
          grade_level?: string | null
          classroom_id?: string | null
          points?: number
          level?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string
          preferred_theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'student' | 'teacher' | 'admin'
          display_name?: string
          avatar_url?: string | null
          school_name?: string | null
          grade_level?: string | null
          classroom_id?: string | null
          points?: number
          level?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string
          preferred_theme?: string
          created_at?: string
          updated_at?: string
        }
      }
      classrooms: {
        Row: {
          id: string
          name: string
          teacher_id: string
          invite_code: string
          school_year: string | null
          ai_generation_daily_limit: number
          allow_crossover_collaborations: boolean
          allow_ai_battles: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          teacher_id: string
          invite_code: string
          school_year?: string | null
          ai_generation_daily_limit?: number
          allow_crossover_collaborations?: boolean
          allow_ai_battles?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          teacher_id?: string
          invite_code?: string
          school_year?: string | null
          ai_generation_daily_limit?: number
          allow_crossover_collaborations?: boolean
          allow_ai_battles?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      mythologies: {
        Row: {
          id: string
          name: string
          description: string | null
          timeframe: string | null
          genre: string | null
          geography_type: string | null
          setting_description: string | null
          cultural_inspiration: string | null
          created_by: string
          classroom_id: string | null
          is_group_project: boolean
          group_members: string[] | null
          visibility: 'public' | 'teacher_only' | 'hidden'
          locked_by_teacher: boolean
          featured: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          timeframe?: string | null
          genre?: string | null
          geography_type?: string | null
          setting_description?: string | null
          cultural_inspiration?: string | null
          created_by: string
          classroom_id?: string | null
          is_group_project?: boolean
          group_members?: string[] | null
          visibility?: 'public' | 'teacher_only' | 'hidden'
          locked_by_teacher?: boolean
          featured?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          timeframe?: string | null
          genre?: string | null
          geography_type?: string | null
          setting_description?: string | null
          cultural_inspiration?: string | null
          created_by?: string
          classroom_id?: string | null
          is_group_project?: boolean
          group_members?: string[] | null
          visibility?: 'public' | 'teacher_only' | 'hidden'
          locked_by_teacher?: boolean
          featured?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      characters: {
        Row: {
          id: string
          mythology_id: string
          created_by: string
          name: string
          character_type: 'god' | 'demigod' | 'hero' | 'mortal' | 'legendary_figure' | 'founder' | 'spirit' | 'other'
          archetype: string | null
          domain: string | null
          description: string | null
          origin_story: string | null
          personality: string | null
          geography_connection: string | null
          powers_abilities: string | null
          weaknesses: string | null
          primary_image_url: string | null
          appearance_description: string | null
          visibility: 'public' | 'teacher_only' | 'hidden'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mythology_id: string
          created_by: string
          name: string
          character_type: 'god' | 'demigod' | 'hero' | 'mortal' | 'legendary_figure' | 'founder' | 'spirit' | 'other'
          archetype?: string | null
          domain?: string | null
          description?: string | null
          origin_story?: string | null
          personality?: string | null
          geography_connection?: string | null
          powers_abilities?: string | null
          weaknesses?: string | null
          primary_image_url?: string | null
          appearance_description?: string | null
          visibility?: 'public' | 'teacher_only' | 'hidden'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mythology_id?: string
          created_by?: string
          name?: string
          character_type?: 'god' | 'demigod' | 'hero' | 'mortal' | 'legendary_figure' | 'founder' | 'spirit' | 'other'
          archetype?: string | null
          domain?: string | null
          description?: string | null
          origin_story?: string | null
          personality?: string | null
          geography_connection?: string | null
          powers_abilities?: string | null
          weaknesses?: string | null
          primary_image_url?: string | null
          appearance_description?: string | null
          visibility?: 'public' | 'teacher_only' | 'hidden'
          created_at?: string
          updated_at?: string
        }
      }
      creatures: {
        Row: {
          id: string
          mythology_id: string
          created_by: string
          name: string
          creature_type: 'beast' | 'monster' | 'magical_being' | 'spirit' | 'undead' | 'construct' | 'hybrid' | 'elemental' | 'dragon' | 'other' | null
          alignment: 'good' | 'neutral' | 'evil' | 'ambiguous' | 'lawful' | 'chaotic' | null
          intelligence_level: 'non_sentient' | 'animal_intelligence' | 'sentient' | 'highly_intelligent' | null
          size_category: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan' | null
          danger_level: 'harmless' | 'minor_threat' | 'dangerous' | 'deadly' | 'catastrophic' | null
          description: string | null
          habitat: string | null
          abilities: string | null
          cultural_significance: string | null
          origin_story: string | null
          weaknesses: string | null
          related_characters: string[] | null
          is_unique: boolean
          primary_image_url: string | null
          visibility: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mythology_id: string
          created_by: string
          name: string
          creature_type?: 'beast' | 'monster' | 'magical_being' | 'spirit' | 'undead' | 'construct' | 'hybrid' | 'elemental' | 'dragon' | 'other' | null
          alignment?: 'good' | 'neutral' | 'evil' | 'ambiguous' | 'lawful' | 'chaotic' | null
          intelligence_level?: 'non_sentient' | 'animal_intelligence' | 'sentient' | 'highly_intelligent' | null
          size_category?: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan' | null
          danger_level?: 'harmless' | 'minor_threat' | 'dangerous' | 'deadly' | 'catastrophic' | null
          description?: string | null
          habitat?: string | null
          abilities?: string | null
          cultural_significance?: string | null
          origin_story?: string | null
          weaknesses?: string | null
          related_characters?: string[] | null
          is_unique?: boolean
          primary_image_url?: string | null
          visibility?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mythology_id?: string
          created_by?: string
          name?: string
          creature_type?: 'beast' | 'monster' | 'magical_being' | 'spirit' | 'undead' | 'construct' | 'hybrid' | 'elemental' | 'dragon' | 'other' | null
          alignment?: 'good' | 'neutral' | 'evil' | 'ambiguous' | 'lawful' | 'chaotic' | null
          intelligence_level?: 'non_sentient' | 'animal_intelligence' | 'sentient' | 'highly_intelligent' | null
          size_category?: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan' | null
          danger_level?: 'harmless' | 'minor_threat' | 'dangerous' | 'deadly' | 'catastrophic' | null
          description?: string | null
          habitat?: string | null
          abilities?: string | null
          cultural_significance?: string | null
          origin_story?: string | null
          weaknesses?: string | null
          related_characters?: string[] | null
          is_unique?: boolean
          primary_image_url?: string | null
          visibility?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
