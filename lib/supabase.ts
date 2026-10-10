import { createClient } from '@supabase/supabase-js'

// Server-only client using the service role key. Returns null when not configured,
// so routes can respond with a clear "not configured" error instead of crashing.
export function adminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}
