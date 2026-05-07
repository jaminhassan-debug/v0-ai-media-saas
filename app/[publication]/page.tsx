import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublicationBySlug, getArticles, getCategories, getFeaturedArticle } from '@/lib/data'
import { ArticleCard } from '@/components/publication/article-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, TrendingUp, Clock, MessageSquare } from 'lucide-react'

interface PublicationPageProps {
  params: Promise<{ publication: string }>
}

export default async function PublicationPage({ params }: PublicationPageProps) {
  const { publication: slug } = await params
  const [publication, featuredArticle, articles, categories] = await Promise.all([
    getPublicationBySlug(slug),
    getFeaturedArticle(slug),
    getArticles(slug, { limit: 12 }),
    getCategories(slug),
  ])

  if (!publication) {
    notFound()
  }

  // Split articles: remove featured, then get latest and by category
  const latestArticles = articles
    .filter(a => a.id !== featuredArticle?.id)
    .slice(0, 6)
  
  const trendingArticles = articles
    .filter(a => a.id !== featuredArticle?.id)
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 5)

  return (
    <div className="bg-background">
      {/* Hero Section with Featured Article */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              {featuredArticle ? (
                <ArticleCard 
                  article={featuredArticle} 
                  publicationSlug={slug}
                  variant="featured"
                />
              ) : (
                <Card className="h-full flex items-center justify-center bg-muted/50">
                  <CardContent className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-2">Welcome to {publication.name}</h2>
                    <p className="text-muted-foreground">{publication.tagline}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Research CTA */}
              <Card className="bg-primary text-primary-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-5 w-5" />
                    AI Research Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Ask questions about {publication.name.toLowerCase()} topics and get instant, 
                    cited answers from our expert content.
                  </p>
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href={`/${slug}/chat`}>
                      Start Research
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Trending */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {trendingArticles.slice(0, 4).map((article, index) => (
                      <Link 
                        key={article.id}
                        href={`/${slug}/${article.slug}`}
                        className="flex items-start gap-3 py-2 group"
                      >
                        <span className="text-2xl font-bold text-muted-foreground/50 w-6">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Quick Links */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-muted-foreground shrink-0">Topics:</span>
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="shrink-0 hover:bg-secondary/80 cursor-pointer"
                asChild
              >
                <Link href={`/${slug}/category/${category.slug}`}>
                  {category.name}
                </Link>
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Latest Analysis</h2>
            <Button variant="ghost" asChild>
              <Link href={`/${slug}/articles`}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard 
                key={article.id}
                article={article}
                publicationSlug={slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Browse by Topic</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categoryArticles = articles.filter(a => a.category_id === category.id)
              return (
                <Link 
                  key={category.id}
                  href={`/${slug}/category/${category.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{categoryArticles.length} articles</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
            <p className="text-muted-foreground mb-6">
              Get the latest {publication.name.toLowerCase()} insights delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-sm"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Free weekly digest. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
