// Sources regulator and press-release feeds, drafts news briefs and tracker entries,
// and queues them for human review. NOTHING is published by this script.
//
//   node scripts/pipeline/articles.mjs          # draft and queue
//   node scripts/pipeline/articles.mjs --dry    # draft and print, do not queue
//   node scripts/pipeline/articles.mjs --max=5  # limit items per feed
import { readFileSync } from 'node:fs'
import { SECTORS, REGIONS, draft, getText, ingest, parseFeed, shortHash, slugify } from './lib.mjs'

const dry = process.argv.includes('--dry')
const max = Number((process.argv.find((a) => a.startsWith('--max=')) ?? '--max=5').split('=')[1])
const { feeds } = JSON.parse(readFileSync(new URL('./sources.json', import.meta.url), 'utf8'))

const SYSTEM = `You are a news editor at Family Wealth Intelligence, a UK-led publication for lawyers, tax advisers, trustees and wealth managers who serve wealthy families.
Write ONLY from the source text supplied. Never add facts, figures, dates, names or legal conclusions that are not in it. If the source is too thin, say so in "skip_reason".
Neutral, precise, no hype. UK spelling. Reply with one JSON object and nothing else.`

const prompt = (feed, item) => `Source: ${feed.name}
Title: ${item.title}
Link: ${item.link}
Published: ${item.date}
Text: ${item.summary}

Return JSON:
{
  "skip_reason": "" or a short reason this is not worth publishing,
  "title": "headline, max 110 chars",
  "standfirst": "one sentence, max 200 chars",
  "sector": one of ${JSON.stringify(SECTORS)},
  "region": one of ${JSON.stringify(REGIONS)},
  "body": ["paragraph 1","paragraph 2","paragraph 3"]  (2 to 4 short paragraphs, last one names the source),
  "tracker": null or { "status_label": "Consultation" | "Proposed" | "Guidance" | "In force", "closes": "YYYY-MM-DD" or null }  (only if this is a regulatory consultation, proposal, guidance or rule change)
}
Default sector "${feed.sector}" and region "${feed.region}" unless the text clearly says otherwise.`

const articles = []
const tracker = []

for (const feed of feeds) {
  let items = []
  try {
    items = parseFeed(await getText(feed.url)).slice(0, max)
  } catch (e) {
    console.error(`! ${feed.name}: ${e.message}`)
    continue
  }
  for (const item of items) {
    const slug = `${slugify(item.title)}-${shortHash(item.link)}`
    try {
      const d = await draft(prompt(feed, item), { system: SYSTEM })
      if (d.skip_reason) { console.log(`- skip ${slug}: ${d.skip_reason}`); continue }
      if (!SECTORS.includes(d.sector) || !REGIONS.includes(d.region) || !Array.isArray(d.body) || d.body.length < 2) { console.log(`- skip ${slug}: invalid draft`); continue }
      articles.push({ slug, title: d.title, standfirst: d.standfirst, kind: 'News', sector: d.sector, region: d.region, author: 'FWI Editorial (draft)', body: d.body, firms: [], source_url: item.link })
      if (feed.tracker && d.tracker?.status_label) {
        tracker.push({ slug, region: d.region, body: feed.name.replace(/\s*\(.*\)$/, ''), title: d.title, status_label: d.tracker.status_label, sector: d.sector, item_date: (item.date || new Date().toISOString()).slice(0, 10), closes: d.tracker.closes || null, source_url: item.link })
      }
      console.log(`+ draft ${slug}`)
    } catch (e) {
      console.error(`! ${slug}: ${e.message}`)
    }
  }
}

console.log(`\n${articles.length} articles, ${tracker.length} tracker items drafted${dry ? ' (dry run, nothing queued)' : ''}`)
if (!dry) {
  if (articles.length) console.log('articles:', await ingest('article', articles))
  if (tracker.length) console.log('tracker:', await ingest('tracker', tracker))
}
