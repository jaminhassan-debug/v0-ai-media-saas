# Family Wealth Intelligence

Information site for advisers serving wealthy families (UK, Europe, US, Asia): news, analysis,
firm directory, data and rankings, regulatory tracker, events and newsletter. Built with Next.js (App Router).

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck && pnpm build
```

## Hosting: GitHub Pages (static export)

The site is a static export (`output: 'export'`), built and deployed by `.github/workflows/pages.yml` on every push to `main`.

**One-time setup:** repo Settings → Pages → Source: **GitHub Actions**. The site then appears at
`https://<owner>.github.io/<repo>/`.

**Custom domain (familywealthintelligence.com):** Settings → Pages → Custom domain, point DNS at GitHub, then set repository
variables `PAGES_BASE_PATH` = `-` (serve from the root) and `SITE_URL` = `https://familywealthintelligence.com`, and re-run the workflow.

## Structure

| Path | Purpose |
| --- | --- |
| `app/` | Pages: home, news, region pages, analysis, sector hubs, article, directory (+ firm profile), data, tracker, events, newsletter, advertise, contact |
| `lib/content.ts` | Types, **fictional seed data** and async getters. Pages only read through the getters, so swapping in Supabase touches this file only |
| `lib/supabase.ts` | Browser client using the public publishable key. Row-level security allows visitors to insert sign-ups/enquiries and read published content only |
| `supabase/schema.sql` | Tables and row-level security (applied to project `srdzgbacbtiitaqifizc`; form-insert policies are in migration `public_insert_forms`) |
| `supabase/functions/ingest` | Edge Function for content agents. Header `x-ingest-secret`; everything lands as `pending_review` |

No secrets live in this repo. The publishable key is public by design. Set the Edge Function secret `INGEST_SECRET` in the Supabase dashboard
(Edge Functions → Secrets); until it is set, the function rejects every request.

## Going live: what is still to do

1. Enable Pages (above) and set `INGEST_SECRET`.
2. Replace the read bodies in `lib/content.ts` with queries on `status = 'published'` rows (build-time fetch; rebuild on publish via a scheduled or manual workflow run).
3. Point the content agents at the ingest function. Legal and tax content should always have human sign-off before `status` becomes `published`.
4. Email platform for newsletter sends; payments for subscriptions and listing upgrades (not wired up). A static site needs a hosted checkout link or a Supabase function for this.
5. Replace all sample content, and confirm every price (all are illustrative).
6. Form inserts are open to anonymous visitors (with length/format checks). Add CAPTCHA or rate limiting if spam appears.

## Notes on the code this replaced

The previous codebase was a v0-generated multi-publication SaaS (IP Law / Family Wealth, auth, Stripe, AI chat).
It was replaced rather than adapted. Issues found in it:

- It built only because `typescript.ignoreBuildErrors` was on. Code referenced undefined functions
  (`incrementArticleView`, `isArticleBookmarked`, `cookies`, `createServerClient`) and fields that do not exist in the types.
- Stripe: invalid `apiVersion`, no webhook, so subscriptions would never have been recorded; prices defined inline in USD.
- Home page linked to `/auth/sign-up` but the route was `/auth/signup`.
- Auth middleware protected `/chat`, but the chat route lived at `/[publication]/chat`, so it was unprotected. It also called Supabase on every request and would fail without env vars.
- `maxTokens` is not a valid option in the AI SDK version used, and the chat model string was unverified.
- The only workflow ran `npm test` (no such script) and published to GitHub Packages. Replaced with a typecheck-and-build CI.
- No database migrations were in the repo, and two divergent `globals.css` files existed.
