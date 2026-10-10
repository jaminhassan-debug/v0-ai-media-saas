# Family Wealth Intelligence

Information site for advisers serving wealthy families (UK, Europe, US, Asia): news, analysis,
firm directory, data and rankings, regulatory tracker, events and newsletter. Built with Next.js (App Router).

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck && pnpm build
```

## Structure

| Path | Purpose |
| --- | --- |
| `app/` | Pages: home, news, analysis, sector hubs, article, directory (+ firm profile), data, tracker, events, newsletter, advertise, contact |
| `lib/content.ts` | Types, **fictional seed data** and async getters. Pages only read through the getters, so swapping in Supabase touches this file only |
| `components/ad.tsx` | Sellable ad slots (leaderboard, MPU) |
| `app/api/subscribe`, `app/api/enquiry` | Newsletter sign-up and enquiry/claim forms. Store to Supabase; return 503 until configured |
| `app/api/ingest` | Endpoint for content agents. Bearer-authenticated; everything lands as `pending_review` |
| `supabase/schema.sql` | Tables and row-level security |

## Going live: what is still to do

1. Create a Supabase project, run `supabase/schema.sql`, and set the variables in `.env.example` on Vercel.
2. Replace the read bodies in `lib/content.ts` with queries on `status = 'published'` rows.
3. Point the content agents at `POST /api/ingest`. Add an editor review step (or use the Supabase table editor) to move items to `published`. Legal and tax content should always have human sign-off.
4. Connect an email platform for the newsletter send, and Stripe for subscriptions and listing upgrades (checkout is deliberately not wired up yet).
5. Replace all sample content, and confirm every price (all are illustrative) before issuing a rate card.

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
