# Autonomous content engine

Articles, directory profiles and the regulatory tracker are populated by agents. **Agents draft; people publish.**

```
 regulator feeds          firm websites
       |                       |
       v                       v
 scripts/pipeline/articles.mjs   scripts/pipeline/firms.mjs     (GitHub Actions, weekdays)
       |  drafts with Claude, tags sector + region, uses ONLY the supplied source text
       v
 Supabase Edge Function `ingest`   (secret header; allow-listed fields; never overwrites)
       |  rows land as status = 'pending_review'
       v
 Editor review in Supabase (Table Editor)  --  legal and tax ALWAYS signed off by a person
       |  editor sets status = 'published'
       v
 Daily site rebuild (GitHub Pages)  -->  live site        Friday: digest built from published items
```

## Safeguards

1. **No auto-publish.** The ingest function forces `status = 'pending_review'`.
2. **Agents cannot touch money fields.** Only an allow-list of fields is stored. Firm `tier`, `claimed`, article `premium` and `sponsor` can never be set by an agent.
3. **Re-runs are safe.** Rows are inserted with ignore-duplicates, so a re-run never resets an article an editor has edited or published.
4. **Source-bound drafting.** The prompt forbids facts that are not in the source text; every draft keeps `source_url` for the editor to check.
5. **Human sign-off for legal and tax.** The review queue should be filtered by sector (Legal, Tax, Regulation, Trusts) and checked by a qualified person before publishing.

## One-time setup

1. In Supabase: Edge Functions > Secrets > add `INGEST_SECRET` (a long random value).
2. In GitHub: Settings > Secrets and variables > Actions > add `INGEST_SECRET` (same value) and `ANTHROPIC_API_KEY`.
3. Run the **Content pipeline** workflow manually with "Dry run" ticked and read the output. Then run it for real.
4. In Supabase Table Editor, open `articles` where `status = pending_review`, check each against its `source_url`, edit as needed, and set `status = published` (and `published_at`).
5. The site picks published rows up at the next daily rebuild (or run the **Deploy to GitHub Pages** workflow).

## Directory seeding (500+ profiles)

Put firms in `scripts/pipeline/firm-seeds.json` (`name`, `website`, `city`, `region`), run `node scripts/pipeline/firms.mjs --dry`, review, then run it for real. Profiles arrive as unverified free listings. Firms become **verified and paid** only through the claim flow.

## Newsletter

`scripts/digest/build.mjs` builds the Friday digest (HTML and Markdown) from published items into `digest/`; the **Weekly newsletter digest** workflow runs it and attaches the files. Paste into your email platform, with the primary sponsor and classified slots marked in the template. Automated sending is a later step once a platform is chosen.

## Adding sources

Edit `scripts/pipeline/sources.json`. Use only public regulator and press-release feeds. Check each feed's terms of use. EU, US and Asian feeds should be added as the regions open.
