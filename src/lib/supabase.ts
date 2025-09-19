import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Debug logging to help identify the issue
console.log('Supabase Environment Check:', {
  url: supabaseUrl,
  urlType: typeof supabaseUrl,
  key: supabaseKey ? 'Present' : 'Missing',
  keyLength: supabaseKey?.length || 0
})

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
  throw new Error('VITE_SUPABASE_URL is not set or contains placeholder value. Please check your .env.local file.')
}

if (!supabaseKey || supabaseKey === 'your_supabase_anon_key') {
  throw new Error('VITE_SUPABASE_ANON_KEY is not set or contains placeholder value. Please check your .env.local file.')
}

// Validate URL format
const urlPattern = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/
if (!urlPattern.test(supabaseUrl)) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Expected format: https://your-project-id.supabase.co`)
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // Use PKCE flow for better security
  },
  global: {
    headers: {
      'X-Client-Info': 'senior-care-plus'
    }
  }
})

// Export for easy access to auth methods
export const auth = supabase.auth