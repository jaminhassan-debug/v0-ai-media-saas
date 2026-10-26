// Supabase Edge Function: endpoint for the autonomous content agents.
// Agents POST drafts here; nothing publishes automatically. Everything lands as
// 'pending_review'; an editor sets status = 'published'. Legal/tax needs human sign-off.
//
//   POST https://<project>.supabase.co/functions/v1/ingest
//   x-ingest-secret: <INGEST_SECRET>
//   { "type": "article" | "firm" | "tracker", "items": [ ... ] }
//
// Safeguards:
//  - only allow-listed fields are stored, so an agent can never set paid or trust fields
//    (firm tier, claimed flag, premium flag, sponsor) or the publication status;
//  - existing rows are never overwritten (ignoreDuplicates), so a re-run cannot reset
//    an article an editor has edited or published.
import { createClient } from 'npm:@supabase/supabase-js@2'

const TABLES = {
  article: { table: 'articles', fields: ['slug', 'title', 'standfirst', 'kind', 'sector', 'region', 'author', 'body', 'firms', 'source_url'] },
  firm: { table: 'firms', fields: ['slug', 'name', 'type', 'sectors', 'regions', 'city', 'summary', 'website', 'source_url'] },
  tracker: { table: 'tracker_items', fields: ['slug', 'region', 'body', 'title', 'status_label', 'sector', 'item_date', 'closes', 'source_url'] },
} as const

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

  const { table, fields } = TABLES[type]
  const rows = items
    .filter((i: unknown): i is Record<string, unknown> => typeof i === 'object' && i !== null && typeof (i as Record<string, unknown>).slug === 'string')
    .map((i: Record<string, unknown>) => {
      const row: Record<string, unknown> = { status: 'pending_review', source: 'agent' }
      for (const f of fields) if (f in i) row[f] = i[f]
      return row
    })
  if (rows.length === 0) return json({ error: 'Every item needs a string slug' }, 400)

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { error } = await db.from(table).upsert(rows, { onConflict: 'slug', ignoreDuplicates: true })
  if (error) return json({ error: error.message }, 500)
  return json({ ok: true, submitted: rows.length })
})
