import Link from 'next/link'
import { getPublications } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Scale, Building2, Sparkles } from 'lucide-react'

export default async function HomePage() {
  const publications = await getPublications()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Legal Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
              AI-Powered Intelligence for
              <span className="text-primary"> Legal Professionals</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
              Expert analysis, breaking news, and AI-powered research across specialized legal verticals. 
              Stay ahead with insights that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#publications">
                  Explore Publications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Expert Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  In-depth articles from leading practitioners and subject matter experts.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI Research Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Ask questions, get instant answers with citations from our content library.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Enterprise Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Team access, API integration, and custom solutions for organizations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Publications */}
        <section id="publications" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Publications</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Specialized intelligence platforms delivering actionable insights for legal professionals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {publications.map((publication) => (
                <Card 
                  key={publication.id} 
                  className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${publication.secondary_color}20` }}
                    >
                      {publication.slug === 'ip-law' ? (
                        <Scale className="h-6 w-6" style={{ color: publication.secondary_color }} />
                      ) : (
                        <Building2 className="h-6 w-6" style={{ color: publication.secondary_color }} />
                      )}
                    </div>
                    <CardTitle className="text-xl">{publication.name}</CardTitle>
                    <CardDescription>{publication.tagline}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">
                      {publication.description}
                    </p>
                    <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      <Link href={`/${publication.slug}`}>
                        Explore {publication.name}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Join thousands of legal professionals who rely on our intelligence platforms 
              for critical insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Legal Intelligence</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Legal Intelligence. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
