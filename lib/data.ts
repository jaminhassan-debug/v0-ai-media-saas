import { createClient } from '@/lib/supabase/server'
import type { Publication, Article, Category, Author, SubscriptionTier, Subscription, Profile } from '@/lib/types/database'

// Publications
export async function getPublications(): Promise<Publication[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data || []
}

export async function getPublicationBySlug(slug: string): Promise<Publication | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) return null
  return data
}

// Articles
export async function getArticles(
  publicationSlug: string,
  options?: {
    limit?: number
    categorySlug?: string
    featured?: boolean
    premium?: boolean
  }
): Promise<Article[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*),
      publication:publications!inner(*)
    `)
    .eq('publication.slug', publicationSlug)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (options?.categorySlug) {
    query = query.eq('category.slug', options.categorySlug)
  }
  if (options?.featured !== undefined) {
    query = query.eq('featured', options.featured)
  }
  if (options?.premium !== undefined) {
    query = query.eq('premium', options.premium)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getArticleBySlug(
  publicationSlug: string,
  articleSlug: string
): Promise<Article | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*),
      publication:publications!inner(*)
    `)
    .eq('publication.slug', publicationSlug)
    .eq('slug', articleSlug)
    .eq('status', 'published')
    .single()

  if (error) return null
  return data
}

export async function getFeaturedArticle(publicationSlug: string): Promise<Article | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*),
      publication:publications!inner(*)
    `)
    .eq('publication.slug', publicationSlug)
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (error) return null
  return data
}

export async function getRelatedArticles(
  publicationSlug: string,
  articleId: string,
  categoryId: string | null,
  limit = 3
): Promise<Article[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*),
      publication:publications!inner(*)
    `)
    .eq('publication.slug', publicationSlug)
    .eq('status', 'published')
    .neq('id', articleId)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

// Categories
export async function getCategories(publicationSlug: string): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data: publication } = await supabase
    .from('publications')
    .select('id')
    .eq('slug', publicationSlug)
    .single()

  if (!publication) return []

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('publication_id', publication.id)
    .order('sort_order')

  if (error) throw error
  return data || []
}

// Authors
export async function getAuthorById(authorId: string): Promise<Author | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('id', authorId)
    .single()

  if (error) return null
  return data
}

// Subscription Tiers
export async function getSubscriptionTiers(): Promise<SubscriptionTier[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('subscription_tiers')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data || []
}

// User Profile
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data
}

// User Subscription
export async function getUserSubscription(
  publicationId: string
): Promise<Subscription | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      tier:subscription_tiers(*),
      publication:publications(*)
    `)
    .eq('user_id', user.id)
    .eq('publication_id', publicationId)
    .single()

  if (error) return null
  return data
}

// Search articles
export async function searchArticles(
  publicationSlug: string,
  query: string,
  limit = 10
): Promise<Article[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*),
      publication:publications!inner(*)
    `)
    .eq('publication.slug', publicationSlug)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
