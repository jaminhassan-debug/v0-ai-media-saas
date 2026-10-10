// Supabase Edge Function: endpoint for the autonomous content agents.
// Agents POST drafts here; nothing publishes automatically. Everything lands as
// 'pending_review'; an editor sets status = 'published'. Legal/tax needs human sign-off.
//
//   POST https://<project>.supabase.co/functions/v1/ingest
//   Authorization: Bearer <INGEST_SECRET>
//   { "type": "article" | "firm" | "tracker", "items": [ ... ] }
import { createClient } from 'npm:@supabase/supabase-js@2'

const TABLES = { article: 'articles', firm: 'firms', tracker: 'tracker_items' } as const
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)
  const secret = Deno.env.get('INGEST_SECRET')
  const given = req.headers.get('x-ingest-secret') ?? ''
  if (!secret || given.length !== secret.length || given !== secret) return json({ error: 'Unauthorised' }, 401)

  const body = await req.json().catch(() => null)
  const type = body?.type as keyof typeof TABLES
  const items = body?.items
  if (!(type in TABLES) || !Array.isArray(items) || items.length === 0 || items.length > 100)
    return json({ error: 'Expected { type, items[1..100] }' }, 400)

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const rows = items.map((i: Record<string, unknown>) => ({ ...i, status: 'pending_review', source: 'agent' }))
  const { error } = await db.from(TABLES[type]).upsert(rows, { onConflict: 'slug' })
  if (error) return json({ error: error.message }, 500)
  return json({ ok: true, queued: rows.length })
})
