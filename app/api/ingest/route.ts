import { timingSafeEqual } from 'node:crypto'
import { adminClient } from '@/lib/supabase'

// Endpoint for the autonomous content agents. They POST drafts here; nothing is
// published automatically. Everything lands as 'pending_review', and legal/tax
// content must be approved by a human editor before status becomes 'published'.
//
//   POST /api/ingest   Authorization: Bearer $INGEST_SECRET
//   { "type": "article" | "firm" | "tracker", "items": [ ... ] }

const TABLES = { article: 'articles', firm: 'firms', tracker: 'tracker_items' } as const
type Kind = keyof typeof TABLES

function authorised(req: Request) {
  const secret = process.env.INGEST_SECRET
  if (!secret) return false
  const given = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const a = Buffer.from(given)
  const b = Buffer.from(secret)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(req: Request) {
  if (!authorised(req)) return Response.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const type = body?.type as Kind
  const items = body?.items
  if (!(type in TABLES) || !Array.isArray(items) || items.length === 0 || items.length > 100)
    return Response.json({ error: 'Expected { type, items[1..100] }' }, { status: 400 })

  const db = adminClient()
  if (!db) return Response.json({ error: 'Database not configured' }, { status: 503 })

  const rows = items.map((i: Record<string, unknown>) => ({ ...i, status: 'pending_review', source: 'agent' }))
  const { error, count } = await db.from(TABLES[type]).upsert(rows, { onConflict: 'slug', count: 'exact' })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true, queued: count ?? rows.length })
}
