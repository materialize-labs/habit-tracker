// This file initializes the Supabase client for browser-side operations.
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // No custom cookie options here, allow library to use defaults
) 