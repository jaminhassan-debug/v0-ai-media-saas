export interface Publication {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  primary_color: string
  secondary_color: string
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface Author {
  id: string
  name: string
  title: string | null
  avatar_url: string | null
  bio: string | null
  linkedin_url: string | null
  twitter_url: string | null
  created_at: string
}

export interface Category {
  id: string
  publication_id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  sort_order: number
  created_at: string
}

export interface Article {
  id: string
  publication_id: string
  category_id: string | null
  author_id: string | null
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image_url: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  premium: boolean
  read_time: number
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
  // Joined fields
  author?: Author
  category?: Category
  publication?: Publication
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  company: string | null
  job_title: string | null
  created_at: string
  updated_at: string
}

export interface SubscriptionTier {
  id: string
  name: string
  price_monthly: number
  price_yearly: number
  features: string[]
  stripe_price_id_monthly: string | null
  stripe_price_id_yearly: string | null
  sort_order: number
}

export interface Subscription {
  id: string
  user_id: string
  publication_id: string
  tier_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
  // Joined fields
  tier?: SubscriptionTier
  publication?: Publication
}

export interface ChatSession {
  id: string
  user_id: string
  publication_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  citations: ArticleCitation[]
  created_at: string
}

export interface ArticleCitation {
  article_id: string
  title: string
  slug: string
  excerpt?: string
}

export interface Bookmark {
  id: string
  user_id: string
  article_id: string
  created_at: string
  article?: Article
}

// Publication theme configuration
export interface PublicationTheme {
  slug: string
  name: string
  colors: {
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    accent: string
    accentForeground: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    card: string
    cardForeground: string
    border: string
  }
}

export const PUBLICATION_THEMES: Record<string, PublicationTheme> = {
  'ip-law': {
    slug: 'ip-law',
    name: 'IP Law Intelligence',
    colors: {
      primary: 'oklch(0.35 0.07 250)', // Deep navy blue
      primaryForeground: 'oklch(0.98 0 0)',
      secondary: 'oklch(0.55 0.15 250)', // Bright blue
      secondaryForeground: 'oklch(0.98 0 0)',
      accent: 'oklch(0.65 0.18 250)', // Light blue accent
      accentForeground: 'oklch(0.15 0.02 250)',
      background: 'oklch(0.99 0.005 250)',
      foreground: 'oklch(0.15 0.02 250)',
      muted: 'oklch(0.95 0.01 250)',
      mutedForeground: 'oklch(0.45 0.02 250)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.15 0.02 250)',
      border: 'oklch(0.90 0.01 250)',
    },
  },
  'family-wealth': {
    slug: 'family-wealth',
    name: 'Family Wealth Intelligence',
    colors: {
      primary: 'oklch(0.30 0.05 145)', // Deep forest green
      primaryForeground: 'oklch(0.98 0 0)',
      secondary: 'oklch(0.75 0.12 85)', // Gold
      secondaryForeground: 'oklch(0.20 0.03 85)',
      accent: 'oklch(0.80 0.10 85)', // Light gold
      accentForeground: 'oklch(0.20 0.05 145)',
      background: 'oklch(0.99 0.005 85)',
      foreground: 'oklch(0.18 0.03 145)',
      muted: 'oklch(0.95 0.01 85)',
      mutedForeground: 'oklch(0.45 0.02 145)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.18 0.03 145)',
      border: 'oklch(0.90 0.01 85)',
    },
  },
}
