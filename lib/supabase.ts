import { createClient } from "@supabase/supabase-js"

// Define the PlanTier interface to match your database schema
export interface PlanTier {
  id: number
  name: string
  price_idr: number
  duration_in_days: number | null
  created_at: string
}

// Create a single supabase client for interacting with your database
const supabaseUrl = "https://kuvsserqztzaraoncxqc.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dnNzZXJxenR6YXJhb25jeHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTEyODMsImV4cCI6MjA2NjA2NzI4M30.8ZWsGNX2_IVAgZUsd8rVjgDfEqrZ0sOVtm56QeyigCk"
export const supabase = createClient(supabaseUrl, supabaseAnonKey)