// Builds the weekly newsletter digest from PUBLISHED content and writes digest/digest.html and digest/digest.md.
// Sending is a separate step (paste into your email platform, or automate once a platform is chosen).
//
//   node scripts/digest/build.mjs [--days=7]
import { mkdirSync, writeFileSync } from 'node:fs'

const days = Number((process.argv.find((a) => a.startsWith('--days=')) ?? '--days=7').split('=')[1])
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://familywealthintelligence.com').replace(/\/$/, '')
if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set')

const since = new Date(Date.now() - days * 864e5).toISOString()
const get = async (path) => {
  const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
  if (!r.ok) throw new Error(`${path} -> HTTP ${r.status}`)
  return r.json()
}
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

const articles = await get(`articles?status=eq.published&published_at=gte.${since}&order=published_at.desc&limit=30&select=slug,title,standfirst,sector,region,kind,premium,sponsor`)
const tracker = await get(`tracker_items?status=eq.published&item_date=gte.${since.slice(0, 10)}&order=item_date.desc&limit=15&select=title,region,status_label,closes`)
const lead = articles.find((a) => a.kind === 'Analysis') ?? articles[0]
const rest = articles.filter((a) => a !== lead).slice(0, 8)
const link = (a) => `${site}/article/${a.slug}/`

mkdirSync('digest', { recursive: true })
writeFileSync('digest/digest.md', [
  `# Family Wealth Intelligence: the week in family wealth`, '',
  lead ? `## ${lead.title}\n${lead.standfirst}\n${link(lead)}` : '_No articles published this week._', '',
  rest.length ? '## Also this week\n' + rest.map((a) => `- [${a.sector} · ${a.region}] ${a.title} ${link(a)}`).join('\n') : '', '',
  tracker.length ? '## Regulatory changes\n' + tracker.map((t) => `- [${t.region}] ${t.title} (${t.status_label}${t.closes ? ', closes ' + t.closes : ''})`).join('\n') : '', '',
  '<!-- PRIMARY SPONSOR SLOT -->', '<!-- CLASSIFIED SLOT -->',
].join('\n'))

writeFileSync('digest/digest.html', `<!doctype html><meta charset="utf-8"><body style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#15181e">
<h1 style="color:#0b1f3a">Family Wealth Intelligence</h1><p style="color:#596070">The week in family wealth</p>
<!-- PRIMARY SPONSOR SLOT -->
${lead ? `<h2><a href="${link(lead)}" style="color:#0b1f3a">${esc(lead.title)}</a></h2><p>${esc(lead.standfirst)}</p>` : '<p>No articles published this week.</p>'}
${rest.length ? '<h3>Also this week</h3><ul>' + rest.map((a) => `<li><a href="${link(a)}">${esc(a.title)}</a> <small>${esc(a.sector)} · ${esc(a.region)}</small></li>`).join('') + '</ul>' : ''}
${tracker.length ? '<h3>Regulatory changes</h3><ul>' + tracker.map((t) => `<li><b>${esc(t.region)}</b> ${esc(t.title)} <small>(${esc(t.status_label)}${t.closes ? ', closes ' + esc(t.closes) : ''})</small></li>`).join('') + '</ul>' : ''}
<!-- CLASSIFIED SLOT -->
<p style="font-size:12px;color:#596070">Information only; not legal, tax or investment advice.</p></body>`)
console.log(`digest built: ${articles.length} articles, ${tracker.length} tracker items`)
