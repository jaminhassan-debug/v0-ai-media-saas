export type Region = 'UK' | 'Europe' | 'US' | 'Asia'
export type Sector = 'Legal' | 'Tax' | 'Wealth Management' | 'Trusts' | 'Philanthropy' | 'Next Gen' | 'Regulation'
export type Tier = 'free' | 'featured' | 'premium'
export type ArticleKind = 'News' | 'Analysis' | 'Opinion' | 'Partner insight'
export type FirmType = 'Law firm' | 'Wealth manager' | 'Trust company' | 'Tax adviser' | 'Family office' | 'Philanthropy adviser'
export type TrackerStatus = 'Consultation' | 'Proposed' | 'Guidance' | 'In force'

export interface Article {
  slug: string
  title: string
  standfirst: string
  kind: ArticleKind
  sector: Sector
  region: Region
  author: string
  date: string // ISO yyyy-mm-dd
  readMins: number
  premium?: boolean
  sponsor?: string
  firms?: string[]
  body: string[]
}

export interface Firm {
  slug: string
  name: string
  type: FirmType
  sectors: Sector[]
  regions: Region[]
  city: string
  tier: Tier
  claimed: boolean
  summary: string
  founded?: number
  size?: string
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
  seats?: number
  cpdHours?: number
}

export interface TrackerItem {
  id: string
  region: Region
  body: string
  title: string
  status: TrackerStatus
  date: string
  closes?: string
  sector: Sector
}

export interface Ranking {
  slug: string
  title: string
  region: Region
  premium: boolean
  head: string[]
  rows: string[][]
}

export interface Product {
  name: string
  price: string
  includes: string
}
