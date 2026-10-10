import { adminClient } from '@/lib/supabase'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL.test(email) || email.length > 254) return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })

  const db = adminClient()
  if (!db) return Response.json({ error: 'Sign-up is not configured yet.' }, { status: 503 })

  const source = typeof body?.source === 'string' ? body.source.slice(0, 40) : 'site'
  const { error } = await db.from('subscribers').upsert({ email, source }, { onConflict: 'email', ignoreDuplicates: true })
  if (error) return Response.json({ error: 'Could not save your sign-up. Please try again.' }, { status: 500 })
  return Response.json({ ok: true })
}
