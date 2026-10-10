import { createClient } from '@supabase/supabase-js'

// Browser client using the PUBLIC publishable key. Safe to ship: row-level security
// only lets visitors insert sign-ups and enquiries, and read published content.
export function browserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}
