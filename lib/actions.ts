'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBookmark(articleId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Check if already bookmarked
  const { data: existing } = await supabase
    .from('user_bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('article_id', articleId)
    .single()

  if (existing) {
    // Remove bookmark
    await supabase
      .from('user_bookmarks')
      .delete()
      .eq('id', existing.id)
    
    return { bookmarked: false }
  } else {
    // Add bookmark
    await supabase
      .from('user_bookmarks')
      .insert({ user_id: user.id, article_id: articleId })
    
    return { bookmarked: true }
  }
}

export async function saveSearchHistory(query: string, publicationId?: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('search_history')
    .insert({
      user_id: user.id,
      query,
      publication_id: publicationId,
    })
}

export async function createChatConversation(publicationId: string, initialQuery?: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      user_id: user.id,
      publication_id: publicationId,
      title: initialQuery?.substring(0, 100) || 'New Conversation',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function saveChatMessage(
  conversationId: string, 
  role: 'user' | 'assistant', 
  content: string,
  citedArticles?: string[]
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      cited_articles: citedArticles,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateConversationTitle(conversationId: string, title: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  await supabase
    .from('chat_conversations')
    .update({ title })
    .eq('id', conversationId)
    .eq('user_id', user.id)
}
