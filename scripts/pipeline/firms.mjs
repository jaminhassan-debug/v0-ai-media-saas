// Compiles directory profiles from firms' own public websites.
// Input: scripts/pipeline/firm-seeds.json  [{ "name": "...", "website": "https://...", "city": "...", "region": "UK" }]
// Output: unverified, unclaimed 'free' profiles queued as pending_review. Tier and claimed are never set by agents;
// firms get verified and upgraded through the claim flow.
//
//   node scripts/pipeline/firms.mjs [--dry]
import { readFileSync } from 'node:fs'
import { SECTORS, REGIONS, draft, getText, ingest, slugify } from './lib.mjs'

const dry = process.argv.includes('--dry')
const TYPES = ['Law firm', 'Wealth manager', 'Trust company', 'Tax adviser', 'Family office', 'Philanthropy adviser']
const seeds = JSON.parse(readFileSync(new URL('./firm-seeds.json', import.meta.url), 'utf8'))

const SYSTEM = `You compile neutral directory profiles for Family Wealth Intelligence.
Use ONLY the website text supplied. No superlatives, no rankings, no claims about quality, no facts not in the text. Reply with one JSON object and nothing else.`

const rows = []
for (const s of seeds) {
  try {
    const html = await getText(s.website)
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 5000)
    const d = await draft(`Firm: ${s.name}\nWebsite: ${s.website}\nCity: ${s.city}\nText: ${text}\n\nReturn JSON: {"skip_reason":"" or reason,"type": one of ${JSON.stringify(TYPES)},"sectors": subset of ${JSON.stringify(SECTORS)} (max 3),"regions": subset of ${JSON.stringify(REGIONS)},"summary":"one neutral sentence, max 200 chars"}`, { system: SYSTEM, maxTokens: 500 })
    if (d.skip_reason || !TYPES.includes(d.type)) { console.log(`- skip ${s.name}: ${d.skip_reason || 'invalid type'}`); continue }
    rows.push({ slug: slugify(s.name), name: s.name, type: d.type, sectors: d.sectors.filter((x) => SECTORS.includes(x)), regions: d.regions.filter((x) => REGIONS.includes(x)).length ? d.regions.filter((x) => REGIONS.includes(x)) : [s.region], city: s.city, summary: d.summary, website: s.website, source_url: s.website })
    console.log(`+ ${s.name}`)
  } catch (e) {
    console.error(`! ${s.name}: ${e.message}`)
  }
}
console.log(`\n${rows.length} profiles drafted${dry ? ' (dry run)' : ''}`)
if (!dry && rows.length) console.log(await ingest('firm', rows))
