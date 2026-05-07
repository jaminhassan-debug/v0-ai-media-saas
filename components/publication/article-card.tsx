import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, Lock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  publicationSlug: string
  variant?: 'default' | 'featured' | 'compact'
}

export function ArticleCard({ article, publicationSlug, variant = 'default' }: ArticleCardProps) {
  const publishedDate = article.published_at 
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
    : 'Draft'

  if (variant === 'featured') {
    return (
      <Link href={`/${publicationSlug}/${article.slug}`} className="block group h-full">
        <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
          <div className="relative aspect-[16/9] md:aspect-[21/9] bg-muted">
            {article.thumbnail_url ? (
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
            )}
            {article.is_premium && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Premium
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-6">
            {article.category_name && (
              <Badge variant="outline" className="mb-3">
                {article.category_name}
              </Badge>
            )}
            <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-muted-foreground mb-4 line-clamp-2 md:line-clamp-3">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {article.author_name && (
                <span className="font-medium text-foreground">{article.author_name}</span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.reading_time || 5} min read
              </span>
              <span>{publishedDate}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/${publicationSlug}/${article.slug}`} className="block group">
        <div className="flex gap-4 py-3">
          {article.thumbnail_url && (
            <div className="relative w-20 h-16 rounded overflow-hidden shrink-0 bg-muted">
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedDate}
            </p>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/${publicationSlug}/${article.slug}`} className="block group h-full">
      <Card className={cn(
        "overflow-hidden h-full hover:shadow-md transition-all duration-300",
        article.is_premium && "ring-1 ring-primary/20"
      )}>
        <div className="relative aspect-[16/10] bg-muted">
          {article.thumbnail_url ? (
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/20">
                {article.title.charAt(0)}
              </span>
            </div>
          )}
          {article.is_premium && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="gap-1 text-xs">
                <Lock className="h-3 w-3" />
                Premium
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          {article.category_name && (
            <Badge variant="outline" className="mb-2 text-xs">
              {article.category_name}
            </Badge>
          )}
          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.reading_time || 5} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.view_count || 0}
              </span>
            </div>
            <span>{publishedDate}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
