import { adminClient } from '@/lib/supabase'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

export async function POST(req: Request) {
  const b = await req.json().catch(() => null)
  const email = clip(b?.email, 254).toLowerCase()
  const name = clip(b?.name, 120)
  if (!name || !EMAIL.test(email)) return Response.json({ error: 'Please enter your name and a valid email.' }, { status: 400 })

  const db = adminClient()
  if (!db) return Response.json({ error: 'Enquiries are not configured yet.' }, { status: 503 })

  const { error } = await db.from('enquiries').insert({
    kind: clip(b?.kind, 40),
    topic: clip(b?.topic, 80),
    target: clip(b?.target, 120),
    name,
    email,
    company: clip(b?.company, 160),
    message: clip(b?.message, 4000),
  })
  if (error) return Response.json({ error: 'Could not send your message. Please try again.' }, { status: 500 })
  return Response.json({ ok: true })
}
