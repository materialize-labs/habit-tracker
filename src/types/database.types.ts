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
      habits: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      habit_completion: {
        Row: {
          id: string
          user_id: string
          habit_id: number
          completion_date: string
        }
        Insert: {
          id?: string
          user_id: string
          habit_id: number
          completion_date: string
        }
        Update: {
          id?: string
          user_id?: string
          habit_id?: number
          completion_date?: string
        }
      }
    }
  }
} 