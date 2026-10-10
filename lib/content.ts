// Content layer. All pages read through the async getters below, so the seed data
// can be swapped for Supabase (see supabase/schema.sql) without touching any page.
// ALL SEED CONTENT IS FICTIONAL PLACEHOLDER DATA. Replace before launch.

export type Region = 'UK' | 'Europe' | 'US' | 'Asia'
export type Sector =
  | 'Legal'
  | 'Tax'
  | 'Wealth Management'
  | 'Trusts'
  | 'Philanthropy'
  | 'Next Gen'
  | 'Regulation'
export type Tier = 'free' | 'featured' | 'premium'

export const REGIONS: Region[] = ['UK', 'Europe', 'US', 'Asia']
export const SECTORS: Sector[] = [
  'Legal',
  'Tax',
  'Wealth Management',
  'Trusts',
  'Philanthropy',
  'Next Gen',
  'Regulation',
]

export const sectorSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-')

export interface Article {
  slug: string
  title: string
  standfirst: string
  kind: 'News' | 'Analysis' | 'Opinion' | 'Partner insight'
  sector: Sector
  region: Region
  author: string
  date: string // ISO
  readMins: number
  premium?: boolean
  sponsor?: string // set on sponsored / partner content
  firms?: string[] // directory slugs mentioned in the piece
  body: string[]
}

export interface Firm {
  slug: string
  name: string
  type: 'Law firm' | 'Wealth manager' | 'Trust company' | 'Tax adviser' | 'Family office' | 'Philanthropy adviser'
  sectors: Sector[]
  regions: Region[]
  city: string
  tier: Tier
  claimed: boolean
  summary: string
  founded?: number
  website?: string
}

export interface Event {
  slug: string
  title: string
  kind: 'Summit' | 'Roundtable' | 'CPD webinar'
  date: string
  city: string
  region: Region
  blurb: string
  capacity?: number
  cpdHours?: number
}

export interface TrackerItem {
  id: string
  region: Region
  body: string // issuing body
  title: string
  status: 'Consultation' | 'Proposed' | 'In force' | 'Guidance'
  date: string
  sector: Sector
}

export interface Ranking {
  slug: string
  title: string
  region: Region
  blurb: string
  premium: boolean
  rows: { rank: number; name: string; metric: string; note: string }[]
}

export const articles: Article[] = [
  {
    slug: 'cross-border-families-rethink-residence-planning',
    title: 'Cross-border families rethink residence planning as tax regimes converge',
    standfirst:
      'Advisers say clients are moving from single-jurisdiction structures to coordinated plans spanning the UK, Europe and the US.',
    kind: 'Analysis',
    sector: 'Tax',
    region: 'UK',
    author: 'FWI Editorial',
    date: '2026-10-08',
    readMins: 7,
    premium: true,
    firms: ['harlow-voss-llp', 'meridian-trust-company'],
    body: [
      'Sample article. Residence rules now sit at the centre of most cross-border planning conversations. Advisers describe a shift from reacting to individual rule changes towards building plans that hold up under several regimes at once.',
      'In practice that means mapping where family members spend time, where assets are held and which entities sit between them, then testing that picture against each jurisdiction’s tests. The work is detailed and rarely quick.',
      'The firms that do it well, interviewees said, combine tax, trusts and immigration advice under one engagement rather than handing the client between specialists.',
    ],
  },
  {
    slug: 'family-office-governance-charters-gain-ground',
    title: 'Family governance charters gain ground among second-generation owners',
    standfirst: 'Written decision rights and dispute processes are becoming a standard part of onboarding for new family offices.',
    kind: 'News',
    sector: 'Wealth Management',
    region: 'Europe',
    author: 'FWI Editorial',
    date: '2026-10-09',
    readMins: 4,
    body: [
      'Sample article. Second-generation owners are asking for clearer rules on who decides what, and how disagreements are resolved before they reach court.',
      'Advisers say a short charter, reviewed every few years, is now more common than the lengthy constitutions of a decade ago.',
    ],
  },
  {
    slug: 'regulators-consult-on-trust-registration-data-sharing',
    title: 'Regulators consult on wider sharing of trust registration data',
    standfirst: 'A consultation asks whether registers should be easier for banks and advisers to query.',
    kind: 'News',
    sector: 'Regulation',
    region: 'UK',
    author: 'FWI Editorial',
    date: '2026-10-09',
    readMins: 3,
    body: [
      'Sample article. The consultation invites views from trustees, banks and advisers on access to registration data and the safeguards that should accompany it.',
      'Responses are due within the standard consultation window. FWI’s regulatory tracker lists the deadline and the issuing body.',
    ],
  },
  {
    slug: 'next-gen-philanthropy-donor-advised-funds',
    title: 'Next-gen donors push philanthropy offices towards measurable impact',
    standfirst: 'Younger family members want reporting on outcomes, not just grants paid.',
    kind: 'Analysis',
    sector: 'Philanthropy',
    region: 'US',
    author: 'FWI Editorial',
    date: '2026-10-07',
    readMins: 6,
    body: [
      'Sample article. Family philanthropy is professionalising. Offices report more demand for impact measurement, shared dashboards and co-funding with other families.',
      'Advisers caution that measurement should stay proportionate to the size of the giving programme.',
    ],
  },
  {
    slug: 'asia-family-offices-set-up-in-hubs',
    title: 'Asian hubs compete for new family office launches',
    standfirst: 'Incentive schemes and licensing clarity are shaping where families choose to base their offices.',
    kind: 'News',
    sector: 'Wealth Management',
    region: 'Asia',
    author: 'FWI Editorial',
    date: '2026-10-08',
    readMins: 4,
    body: [
      'Sample article. Competing hubs are refining their offers to family offices, focusing on licensing, tax treatment and talent.',
      'Advisers say families weigh lifestyle and succession planning as heavily as headline incentives.',
    ],
  },
  {
    slug: 'trust-disputes-trustee-duties-in-focus',
    title: 'Trustee duties in focus as contentious trust work rises',
    standfirst: 'Litigators report more disputes over information rights and exercise of discretion.',
    kind: 'Analysis',
    sector: 'Trusts',
    region: 'UK',
    author: 'FWI Editorial',
    date: '2026-10-06',
    readMins: 8,
    premium: true,
    firms: ['harlow-voss-llp'],
    body: [
      'Sample article. Contentious trust work is growing as wealth passes to a generation less familiar with the structures it inherits.',
      'Practitioners point to clear records of trustee reasoning as the single most useful protection.',
    ],
  },
  {
    slug: 'succession-planning-a-practical-checklist',
    title: 'Succession planning: where to start when the family business is the main asset',
    standfirst: 'A partner-written guide to sequencing governance, tax and ownership decisions.',
    kind: 'Partner insight',
    sector: 'Legal',
    region: 'UK',
    author: 'Harlow & Voss LLP',
    date: '2026-10-05',
    readMins: 5,
    sponsor: 'Harlow & Voss LLP',
    firms: ['harlow-voss-llp'],
    body: [
      'Sample sponsored content. This article is written and paid for by the named partner and does not represent the views of FWI.',
      'Start with a clear statement of what the family wants the business to achieve, then work backwards to ownership and tax structure.',
    ],
  },
  {
    slug: 'swiss-and-uk-advisers-on-private-client-reform',
    title: 'Swiss and UK advisers compare notes on private client reform',
    standfirst: 'Roundtable participants discuss how rule changes are reshaping client conversations.',
    kind: 'Opinion',
    sector: 'Legal',
    region: 'Europe',
    author: 'FWI Editorial',
    date: '2026-10-04',
    readMins: 5,
    body: [
      'Sample article. Participants agreed that clients want certainty, and that certainty is in short supply.',
      'The discussion will continue at the FWI London Roundtable series.',
    ],
  },
  {
    slug: 'sustainable-investing-family-portfolios',
    title: 'Family portfolios revisit sustainable investing mandates',
    standfirst: 'Investment committees are tightening definitions and reporting.',
    kind: 'News',
    sector: 'Wealth Management',
    region: 'US',
    author: 'FWI Editorial',
    date: '2026-10-03',
    readMins: 4,
    body: [
      'Sample article. Mandates are being rewritten to be more specific about what counts, and how it is measured.',
    ],
  },
  {
    slug: 'next-gen-education-programmes',
    title: 'Education programmes for the next generation move from optional to expected',
    standfirst: 'Families are building structured learning paths for heirs.',
    kind: 'Analysis',
    sector: 'Next Gen',
    region: 'UK',
    author: 'FWI Editorial',
    date: '2026-10-02',
    readMins: 6,
    body: [
      'Sample article. Structured programmes cover financial literacy, governance and philanthropy, often delivered with outside advisers.',
    ],
  },
]

export const firms: Firm[] = [
  {
    slug: 'harlow-voss-llp',
    name: 'Harlow & Voss LLP',
    type: 'Law firm',
    sectors: ['Legal', 'Trusts', 'Tax'],
    regions: ['UK', 'Europe'],
    city: 'London',
    tier: 'premium',
    claimed: true,
    founded: 1987,
    summary: 'Private client and family business law firm advising on trusts, succession and cross-border residence.',
    website: 'https://example.com/harlow-voss',
  },
  {
    slug: 'meridian-trust-company',
    name: 'Meridian Trust Company',
    type: 'Trust company',
    sectors: ['Trusts', 'Wealth Management'],
    regions: ['UK', 'Europe'],
    city: 'Jersey',
    tier: 'premium',
    claimed: true,
    founded: 1998,
    summary: 'Independent fiduciary services for international families, including trust and foundation administration.',
    website: 'https://example.com/meridian',
  },
  {
    slug: 'calder-lane-family-office',
    name: 'Calder Lane Family Office',
    type: 'Family office',
    sectors: ['Wealth Management', 'Next Gen'],
    regions: ['UK'],
    city: 'Edinburgh',
    tier: 'featured',
    claimed: true,
    summary: 'Multi-family office covering investment oversight, reporting and next-generation education.',
  },
  {
    slug: 'north-quay-tax-advisers',
    name: 'North Quay Tax Advisers',
    type: 'Tax adviser',
    sectors: ['Tax'],
    regions: ['UK', 'US'],
    city: 'Manchester',
    tier: 'featured',
    claimed: true,
    summary: 'Personal and family tax planning for internationally mobile clients.',
  },
  {
    slug: 'lakeshore-wealth-partners',
    name: 'Lakeshore Wealth Partners',
    type: 'Wealth manager',
    sectors: ['Wealth Management'],
    regions: ['US'],
    city: 'Chicago',
    tier: 'featured',
    claimed: true,
    summary: 'Independent wealth management for multi-generational families.',
  },
  {
    slug: 'orchid-bay-philanthropy',
    name: 'Orchid Bay Philanthropy Advisory',
    type: 'Philanthropy adviser',
    sectors: ['Philanthropy', 'Next Gen'],
    regions: ['Asia'],
    city: 'Singapore',
    tier: 'free',
    claimed: false,
    summary: 'Strategy and governance support for family foundations and giving programmes.',
  },
  {
    slug: 'alder-and-finch',
    name: 'Alder & Finch',
    type: 'Law firm',
    sectors: ['Legal', 'Regulation'],
    regions: ['Europe'],
    city: 'Zurich',
    tier: 'free',
    claimed: false,
    summary: 'Cross-border private client and regulatory advice.',
  },
  {
    slug: 'brightwater-trustees',
    name: 'Brightwater Trustees',
    type: 'Trust company',
    sectors: ['Trusts'],
    regions: ['UK'],
    city: 'Guernsey',
    tier: 'free',
    claimed: false,
    summary: 'Professional trustee services for private clients.',
  },
  {
    slug: 'sakura-heritage-partners',
    name: 'Sakura Heritage Partners',
    type: 'Family office',
    sectors: ['Wealth Management', 'Legal'],
    regions: ['Asia'],
    city: 'Tokyo',
    tier: 'free',
    claimed: false,
    summary: 'Family office advisory with a focus on succession planning.',
  },
  {
    slug: 'kingsmead-private-client',
    name: 'Kingsmead Private Client Lawyers',
    type: 'Law firm',
    sectors: ['Legal', 'Trusts'],
    regions: ['UK'],
    city: 'Bristol',
    tier: 'free',
    claimed: false,
    summary: 'Wills, trusts and probate for established families.',
  },
]

export const events: Event[] = [
  {
    slug: 'fwi-london-summit-2027',
    title: 'FWI Family Wealth Summit London',
    kind: 'Summit',
    date: '2027-09-23',
    city: 'London',
    region: 'UK',
    blurb: 'One day, 120 senior advisers and families. Panels on cross-border planning, governance and philanthropy.',
    capacity: 120,
  },
  {
    slug: 'trusts-roundtable-jan',
    title: 'Trusts & Fiduciary Roundtable',
    kind: 'Roundtable',
    date: '2027-01-21',
    city: 'London',
    region: 'UK',
    blurb: 'Invite-only roundtable on trustee duties and disputes. Sponsor-supported.',
    capacity: 30,
  },
  {
    slug: 'cpd-webinar-residence',
    title: 'Residence planning for cross-border families',
    kind: 'CPD webinar',
    date: '2026-11-12',
    city: 'Online',
    region: 'UK',
    blurb: 'A 60-minute CPD webinar with practitioner speakers.',
    cpdHours: 1,
  },
  {
    slug: 'cpd-webinar-governance',
    title: 'Family governance charters in practice',
    kind: 'CPD webinar',
    date: '2026-12-03',
    city: 'Online',
    region: 'Europe',
    blurb: 'How advisers draft, review and enforce family charters.',
    cpdHours: 1,
  },
]

export const tracker: TrackerItem[] = [
  { id: 't1', region: 'UK', body: 'HM Treasury', title: 'Consultation on trust registration data access', status: 'Consultation', date: '2026-10-09', sector: 'Regulation' },
  { id: 't2', region: 'UK', body: 'HMRC', title: 'Updated guidance on residence and the statutory residence test', status: 'Guidance', date: '2026-10-07', sector: 'Tax' },
  { id: 't3', region: 'Europe', body: 'European Commission', title: 'Proposal on beneficial ownership transparency', status: 'Proposed', date: '2026-10-05', sector: 'Regulation' },
  { id: 't4', region: 'US', body: 'IRS', title: 'Notice on reporting for certain foreign trusts', status: 'Guidance', date: '2026-10-03', sector: 'Tax' },
  { id: 't5', region: 'Asia', body: 'Monetary authority (sample)', title: 'Revised licensing criteria for single-family offices', status: 'In force', date: '2026-10-01', sector: 'Wealth Management' },
  { id: 't6', region: 'Europe', body: 'Swiss FDF (sample)', title: 'Consultation on fiduciary reporting', status: 'Consultation', date: '2026-09-28', sector: 'Trusts' },
]

export const rankings: Ranking[] = [
  {
    slug: 'uk-private-client-law-firms',
    title: 'UK Private Client Law Firms — sample ranking',
    region: 'UK',
    blurb: 'Illustrative layout. Real rankings need a published methodology and reviewed submissions.',
    premium: false,
    rows: [
      { rank: 1, name: 'Harlow & Voss LLP', metric: '4.6', note: 'Trusts, succession' },
      { rank: 2, name: 'Kingsmead Private Client Lawyers', metric: '4.3', note: 'Wills, probate' },
      { rank: 3, name: 'Alder & Finch', metric: '4.1', note: 'Cross-border' },
    ],
  },
  {
    slug: 'family-office-launches-by-hub',
    title: 'Family Office Launches by Hub — sample table',
    region: 'Asia',
    blurb: 'Illustrative table. Full dataset and download is a subscriber product.',
    premium: true,
    rows: [
      { rank: 1, name: 'Hub A', metric: '—', note: 'Subscriber data' },
      { rank: 2, name: 'Hub B', metric: '—', note: 'Subscriber data' },
      { rank: 3, name: 'Hub C', metric: '—', note: 'Subscriber data' },
    ],
  },
]

// ---- async getters (swap the bodies for Supabase queries later) ----

const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date)

export async function getArticles(opts: { kind?: Article['kind']; sector?: Sector; region?: Region; limit?: number } = {}) {
  let list = [...articles].sort(byDateDesc)
  if (opts.kind) list = list.filter((a) => a.kind === opts.kind)
  if (opts.sector) list = list.filter((a) => a.sector === opts.sector)
  if (opts.region) list = list.filter((a) => a.region === opts.region)
  return opts.limit ? list.slice(0, opts.limit) : list
}
export async function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug) ?? null
}
export async function getFirms() {
  const order: Record<Tier, number> = { premium: 0, featured: 1, free: 2 }
  return [...firms].sort((a, b) => order[a.tier] - order[b.tier] || a.name.localeCompare(b.name))
}
export async function getFirm(slug: string) {
  return firms.find((f) => f.slug === slug) ?? null
}
export async function getEvents() {
  return [...events].sort((a, b) => a.date.localeCompare(b.date))
}
export async function getTracker() {
  return [...tracker].sort(byDateDesc)
}
export async function getRankings() {
  return rankings
}

export const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
