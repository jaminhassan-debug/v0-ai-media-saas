import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Ad } from '@/components/ad'
import { FirmCard } from '@/components/firm-card'
import { NewsletterBand } from '@/components/newsletter-band'
import { articles, fmtDate, getArticle, getFirm } from '@/lib/content'

export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await getArticle((await params).slug)
  return a ? { title: a.title, description: a.standfirst } : {}
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getArticle((await params).slug)
  if (!a) notFound()
  const sponsored = a.kind === 'Partner insight'
  const mentioned = (await Promise.all((a.firms ?? []).map(getFirm))).filter((f) => f !== null)
  const visible = a.premium ? a.body.slice(0, 1) : a.body

  return (
    <div className="wrap">
      <Ad size="leader" />
      <article className="article">
        {sponsored && (
          <p className="disclosure"><b>Sponsored content.</b> Written and paid for by {a.sponsor}. It does not represent the views of Family Wealth Intelligence.</p>
        )}
        <span className={`kicker ${sponsored ? 'sponsored' : ''}`}>{a.kind} · {a.sector} · {a.region}</span>
        <h1>{a.title}</h1>
        <p className="standfirst">{a.standfirst}</p>
        <div className="byline meta">By {a.author} · {fmtDate(a.date)} · {a.readMins} min read</div>
        <div className="body">{visible.map((p, i) => <p key={i}>{p}</p>)}</div>
        {a.premium && (
          <div className="paywall">
            <div className="paybox">
              <h3>This analysis is for subscribers</h3>
              <p className="meta">Read the full piece, plus every analysis article and regulatory alerts for your jurisdictions.</p>
              <Link className="btn brass" href="/data#plans">Subscribe</Link>{' '}
              <Link className="btn ghost" href="/newsletter">Get the free newsletter</Link>
            </div>
          </div>
        )}
        {mentioned.length > 0 && (
          <section className="mentioned">
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Firms mentioned</h2>
            <div className="cols2">{mentioned.map((f) => <FirmCard key={f.slug} f={f} />)}</div>
          </section>
        )}
      </article>
      <NewsletterBand source="article" />
    </div>
  )
}
