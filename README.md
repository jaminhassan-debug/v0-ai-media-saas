# Family Wealth Intelligence

Information site for the advisers who serve wealthy families (UK, Europe, US, Asia): news, analysis, a firm directory, data and rankings, a regulatory tracker, events and a newsletter. Built to be monetised from day one.

Blueprint: launch UK-first, tag all content by region, sell directory and sponsor revenue first, and treat events as the year-two margin engine. See `docs/BUSINESS-PLAN.md`.

```bash
pnpm install
pnpm dev                      # http://localhost:3000
pnpm typecheck && pnpm build  # static export to ./out
```

## Documents

| File | What it is |
| --- | --- |
| `docs/BUSINESS-PLAN.md` | 12-month plan, revenue stack, revenue scenario with assumptions, KPIs, risks |
| `docs/RATE-CARD.md` | Sponsor rate card and subscription plans (illustrative prices) |
| `docs/CONTENT-ENGINE.md` | How agents draft content and how humans approve it |
| `docs/LAUNCH-CHECKLIST.md` | What must be true before public launch |

## Site map

News, Analysis, Directory (+ firm profiles with claim flow), Data & Rankings (three databases), Regulatory Tracker, Events & CPD, Newsletter, Advertise; seven sector hubs (Legal, Tax, Wealth Management, Trusts, Philanthropy, Next Gen, Regulation); four region views (UK, Europe, US, Asia); site search; About; Contact.

## How it works

- **Static site** (`output: 'export'`) on GitHub Pages. `.github/workflows/pages.yml` builds on every push to `main` and **every day**, so newly published content goes live.
- **Content** is read at build time from Supabase rows with `status = 'published'` (`lib/content.ts`). Until the first article is published it shows fictional seed data from `lib/seed.ts`.
- **Forms** (newsletter, enquiries, claims) insert directly into Supabase using the public publishable key. Row-level security allows inserts only.
- **Content engine** (`scripts/pipeline`): agents draft news, tracker items and directory profiles and queue them via the `ingest` Edge Function as `pending_review`. People publish. See `docs/CONTENT-ENGINE.md`.
- **Newsletter digest** (`scripts/digest`): built weekly from published items.

| Path | Purpose |
| --- | --- |
| `app/`, `components/` | Next.js pages and UI |
| `lib/content.ts`, `lib/seed.ts`, `lib/types.ts` | Content layer, fictional seed data, types |
| `supabase/schema.sql` | Tables and row-level security (project `srdzgbacbtiitaqifizc`) |
| `supabase/functions/ingest` | Agent ingest endpoint (secret header, field allow-list, never overwrites) |
| `scripts/pipeline`, `scripts/digest` | Content pipeline and newsletter digest |
| `.github/workflows` | CI, Pages deploy, content pipeline, weekly digest |

## Hosting on GitHub Pages

Settings > Pages > Source: **GitHub Actions**. Custom domain: add it under Pages, then set repository variables `PAGES_BASE_PATH` = `-` and `SITE_URL` = `https://familywealthintelligence.com`.

## Secrets and variables

No secrets are in the repo. The publishable Supabase key is public by design.

| Where | Name | Purpose |
| --- | --- | --- |
| Supabase > Edge Functions > Secrets | `INGEST_SECRET` | Authorises the content pipeline |
| GitHub > Actions secrets | `INGEST_SECRET`, `ANTHROPIC_API_KEY` | Used by the content pipeline workflow |
| GitHub > Actions variables | `SITE_URL`, `PAGES_BASE_PATH` | Custom domain |

## Still to do before launch

Everything in `docs/LAUNCH-CHECKLIST.md`. The main items: replace placeholder content, confirm prices, add payment and email-platform integration, add privacy and cookie notices, add spam protection to forms, and move Supabase to a paid plan so it does not pause.
