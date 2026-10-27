// Content layer. Every page reads through the async getters below.
//
// Source of truth, in order:
//   1. Supabase rows with status = 'published' (agents queue drafts via the ingest function;
//      an editor publishes them). Read at BUILD time, so the site rebuilds on a schedule.
//   2. Fictional seed data in ./seed.ts, used until the first article is published.
import { products, sectorNotes, seedArticles, seedEvents, seedFirms, seedRankings, seedTracker } from './seed'
import type { Article, Event, Firm, Ranking, Region, Sector, Tier, TrackerItem } from './types'

export * from './types'
export { products, sectorNotes }

export const REGIONS: Region[] = ['UK', 'Europe', 'US', 'Asia']
export const SECTORS: Sector[] = ['Legal', 'Tax', 'Wealth Management', 'Trusts', 'Philanthropy', 'Next Gen', 'Regulation']
export const sectorSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-')
export const regionSlug = (r: string) => r.toLowerCase()

type Row = Record<string, unknown>

// Returns null ONLY when Supabase is not configured (local development). If it is configured but
// unreachable (for example a paused project), this THROWS so the build fails and the last good
// deploy stays live, instead of silently publishing the fictional seed data over real content.
async function remote(table: string): Promise<Row[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  const res = await fetch(`${url}/rest/v1/${table}?status=eq.published&select=*&limit=1000`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'force-cache',
    signal: AbortSignal.timeout(20000),
  }).catch((e: unknown) => {
    throw new Error(`Supabase unreachable while reading "${table}" (is the project paused?): ${e instanceof Error ? e.message : e}`)
  })
  if (!res.ok) throw new Error(`Supabase returned HTTP ${res.status} reading "${table}" (is the project paused?)`)
  return (await res.json()) as Row[]
}

const str = (v: unknown, d = '') => (typeof v === 'string' ? v : d)
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])

let articleCache: Promise<Article[]> | null = null
let firmCache: Promise<Firm[]> | null = null
let trackerCache: Promise<TrackerItem[]> | null = null

function loadArticles() {
  articleCache ??= remote('articles').then((rows) => {
    if (!rows || rows.length === 0) return seedArticles
    return rows.map((r): Article => {
      const body = arr<string>(r.body)
      const words = body.join(' ').split(/\s+/).length
      return {
        slug: str(r.slug),
        title: str(r.title),
        standfirst: str(r.standfirst),
        kind: str(r.kind, 'News') as Article['kind'],
        sector: str(r.sector, 'Legal') as Sector,
        region: str(r.region, 'UK') as Region,
        author: str(r.author, 'FWI Editorial'),
        date: str(r.published_at, str(r.created_at)).slice(0, 10),
        readMins: Math.max(2, Math.round(words / 220)),
        premium: Boolean(r.premium),
        sponsor: r.sponsor ? str(r.sponsor) : undefined,
        firms: arr<string>(r.firms),
        body,
        sources: arr<{ title: string; url: string }>(r.sources),
      }
    })
  })
  return articleCache
}

function loadFirms() {
  firmCache ??= remote('firms').then((rows) => {
    if (!rows || rows.length === 0) return seedFirms
    return rows.map((r): Firm => ({
      slug: str(r.slug),
      name: str(r.name),
      type: str(r.type, 'Law firm') as Firm['type'],
      sectors: arr<Sector>(r.sectors),
      regions: arr<Region>(r.regions),
      city: str(r.city),
      tier: str(r.tier, 'free') as Tier,
      claimed: Boolean(r.claimed),
      summary: str(r.summary),
      website: r.website ? str(r.website) : undefined,
    }))
  })
  return firmCache
}

function loadTracker() {
  trackerCache ??= remote('tracker_items').then((rows) => {
    if (!rows || rows.length === 0) return seedTracker
    return rows.map((r): TrackerItem => ({
      id: str(r.slug),
      region: str(r.region, 'UK') as Region,
      body: str(r.body),
      title: str(r.title),
      status: str(r.status_label, 'Consultation') as TrackerItem['status'],
      date: str(r.item_date),
      closes: r.closes ? str(r.closes) : undefined,
      sector: str(r.sector, 'Regulation') as Sector,
    }))
  })
  return trackerCache
}

const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date)
const TIER_ORDER: Record<Tier, number> = { premium: 0, featured: 1, free: 2 }
export const tierSort = (a: Firm, b: Firm) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.name.localeCompare(b.name)

export async function getArticles(opts: { kinds?: Article['kind'][]; sector?: Sector; region?: Region; limit?: number } = {}) {
  let list = [...(await loadArticles())].sort(byDateDesc)
  if (opts.kinds) list = list.filter((a) => opts.kinds!.includes(a.kind))
  if (opts.sector) list = list.filter((a) => a.sector === opts.sector)
  if (opts.region) list = list.filter((a) => a.region === opts.region)
  return opts.limit ? list.slice(0, opts.limit) : list
}
export async function getArticle(slug: string) {
  return (await loadArticles()).find((a) => a.slug === slug) ?? null
}
export async function getFirms() {
  return [...(await loadFirms())].sort(tierSort)
}
export async function getFirm(slug: string) {
  return (await loadFirms()).find((f) => f.slug === slug) ?? null
}
export async function getTracker() {
  return [...(await loadTracker())].sort(byDateDesc)
}
export async function getEvents(): Promise<Event[]> {
  return [...seedEvents].sort((a, b) => a.date.localeCompare(b.date))
}
export async function getRankings(): Promise<Ranking[]> {
  return seedRankings
}

export const fmtDate = (iso: string) =>
  iso ? new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ''
