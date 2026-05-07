'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Bookmark, Share2, Check } from 'lucide-react'
import { toggleBookmark } from '@/lib/actions'
import { cn } from '@/lib/utils'

interface ArticleActionsProps {
  articleId: string
  isBookmarked: boolean
  isLoggedIn: boolean
}

export function ArticleActions({ articleId, isBookmarked: initialBookmarked, isLoggedIn }: ArticleActionsProps) {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleBookmark() {
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }

    setIsLoading(true)
    try {
      const result = await toggleBookmark(articleId)
      setIsBookmarked(result.bookmarked)
    } catch (error) {
      console.error('[v0] Failed to toggle bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleShare() {
    const url = window.location.href
    
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: url,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBookmark}
        disabled={isLoading}
        className={cn(isBookmarked && 'bg-primary/10 border-primary/20')}
      >
        <Bookmark className={cn('h-4 w-4 mr-2', isBookmarked && 'fill-primary text-primary')} />
        {isBookmarked ? 'Saved' : 'Save'}
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Copied
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </>
        )}
      </Button>
    </div>
  )
}
