// Shared helpers for the content pipeline. Node 22, no dependencies.
import { createHash } from 'node:crypto'

export const SECTORS = ['Legal', 'Tax', 'Wealth Management', 'Trusts', 'Philanthropy', 'Next Gen', 'Regulation']
export const REGIONS = ['UK', 'Europe', 'US', 'Asia']

export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)
export const shortHash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 6)

const unescapeXml = (s) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&')
const stripTags = (s) => unescapeXml(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const pick = (block, tag) => {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
  return m ? stripTags(m[1]) : ''
}

// Minimal RSS 2.0 / Atom parser. Returns [{ title, link, date, summary }].
export function parseFeed(xml) {
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) ?? []
  return blocks.map((b) => {
    const linkAttr = b.match(/<link[^>]*href="([^"]+)"/i)
    return {
      title: pick(b, 'title'),
      link: linkAttr ? linkAttr[1] : pick(b, 'link'),
      date: (pick(b, 'updated') || pick(b, 'pubDate') || pick(b, 'published')).slice(0, 40),
      summary: (pick(b, 'summary') || pick(b, 'description') || pick(b, 'content')).slice(0, 1500),
    }
  }).filter((i) => i.title && i.link)
}

export async function getText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'FWI-content-pipeline/1.0 (+https://familywealthintelligence.com)' }, signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`)
  return res.text()
}

// Draft with Claude. The model may only use the supplied source text.
export async function draft(prompt, { system, maxTokens = 1200 } = {}) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.DRAFT_MODEL || 'claude-sonnet-5-5',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: AbortSignal.timeout(60000),
  })
  if (!res.ok) throw new Error(`Anthropic API HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  const text = data.content?.filter((c) => c.type === 'text').map((c) => c.text).join('') ?? ''
  const json = text.match(/\{[\s\S]*\}/)
  if (!json) throw new Error('Model did not return JSON')
  return JSON.parse(json[0])
}

export async function ingest(type, items) {
  const url = process.env.INGEST_URL
  const secret = process.env.INGEST_SECRET
  if (!url || !secret) throw new Error('INGEST_URL and INGEST_SECRET must be set')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-ingest-secret': secret },
    body: JSON.stringify({ type, items }),
    signal: AbortSignal.timeout(30000),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`ingest ${type} -> HTTP ${res.status} ${JSON.stringify(body)}`)
  return body
}
