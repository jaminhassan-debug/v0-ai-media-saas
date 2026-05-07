import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPublicationBySlug, getArticleBySlug, getArticles, getCurrentProfile } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ArticleCard } from '@/components/publication/article-card'
import { Clock, Eye, Calendar, Share2, MessageSquare, Lock, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

interface ArticlePageProps {
  params: Promise<{ publication: string; slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { publication: pubSlug, slug } = await params
  const article = await getArticleBySlug(pubSlug, slug)
  
  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: article.title,
    description: article.excerpt || article.meta_description,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.meta_description,
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { publication: pubSlug, slug } = await params
  const [publication, article, user] = await Promise.all([
    getPublicationBySlug(pubSlug),
    getArticleBySlug(pubSlug, slug),
    getCurrentProfile(),
  ])

  if (!publication || !article) {
    notFound()
  }

  // Increment view count (fire and forget)
  incrementArticleView(article.id).catch(() => {})

  // Get related articles
  const relatedArticles = await getArticles(pubSlug, {
    categoryId: article.category_id,
    limit: 4,
  }).then(articles => articles.filter(a => a.id !== article.id).slice(0, 3))

  // Check if user is premium for premium content access
  const canAccessPremium = user?.subscription_tier === 'premium' || user?.subscription_tier === 'enterprise'
  const showPaywall = article.is_premium && !canAccessPremium

  // Check if article is bookmarked
  const isBookmarked = user ? await isArticleBookmarked(user.id, article.id) : false

  const publishedDate = article.published_at 
    ? format(new Date(article.published_at), 'MMMM d, yyyy')
    : 'Draft'

  return (
    <article className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={`/${pubSlug}`} className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <span>/</span>
            {article.category_name && (
              <>
                <Link 
                  href={`/${pubSlug}/category/${article.category_slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {article.category_name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground truncate">{article.title}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="py-8 md:py-12 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.category_name && (
              <Badge variant="default">{article.category_name}</Badge>
            )}
            {article.is_premium && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" />
                Premium
              </Badge>
            )}
            {article.is_featured && (
              <Badge variant="outline">Featured</Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-balance">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              {article.excerpt}
            </p>
          )}

          {/* Author and Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {article.author_avatar && (
                <Avatar className="h-12 w-12">
                  <AvatarImage src={article.author_avatar} alt={article.author_name || 'Author'} />
                  <AvatarFallback>{article.author_name?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
              )}
              <div>
                {article.author_name && (
                  <p className="font-semibold">{article.author_name}</p>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {publishedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.reading_time || 5} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.view_count || 0} views
                  </span>
                </div>
              </div>
            </div>

            <ArticleActions 
              articleId={article.id}
              isBookmarked={isBookmarked}
              isLoggedIn={!!user}
            />
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.thumbnail_url && (
        <div className="container mx-auto px-4 max-w-4xl py-8">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="max-w-none">
            {showPaywall ? (
              /* Paywall for Premium Content */
              <div className="relative">
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none line-clamp-[10]"
                  dangerouslySetInnerHTML={{ 
                    __html: article.content?.substring(0, 1000) || '<p>Content not available.</p>' 
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
                
                <Card className="mt-8 text-center">
                  <CardContent className="py-12">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-2xl font-bold mb-2">Premium Content</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      This article is available exclusively for premium subscribers. 
                      Upgrade to unlock full access to all our expert analysis.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button size="lg" asChild>
                        <Link href="/pricing">Upgrade to Premium</Link>
                      </Button>
                      {!user && (
                        <Button size="lg" variant="outline" asChild>
                          <Link href="/auth/login">Sign In</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Full Article Content */
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ 
                  __html: article.content || '<p>Content not available.</p>' 
                }}
              />
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* AI Research CTA */}
            <Card className="mt-12 bg-primary/5 border-primary/20">
              <CardContent className="py-8">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Have Questions About This Topic?
                    </h3>
                    <p className="text-muted-foreground">
                      Use our AI Research Assistant to ask follow-up questions and get 
                      instant, cited answers from our comprehensive content library.
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/${pubSlug}/chat?context=${article.id}`}>
                      Ask AI Assistant
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {relatedArticles.map((relatedArticle) => (
                      <ArticleCard
                        key={relatedArticle.id}
                        article={relatedArticle}
                        publicationSlug={pubSlug}
                        variant="compact"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Newsletter */}
            <Card>
              <CardContent className="py-6">
                <h3 className="font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest {publication.name.toLowerCase()} insights in your inbox.
                </p>
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/${pubSlug}#newsletter`}>Subscribe</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </article>
  )
}
