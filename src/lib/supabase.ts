import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// During build time, these might not be available, so we'll create a dummy client
// that won't be used during static generation
let client

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    // During build time, create a dummy client
    console.warn('Supabase environment variables not available during build. Using dummy client.')
    client = createClient('https://dummy.supabase.co', 'dummy-key')
  } else {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }
} else {
  client = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = client