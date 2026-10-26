import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EnquiryForm } from '@/components/enquiry-form'
import { Story } from '@/components/story'
import { getArticles, getFirm, getFirms } from '@/lib/content'

export async function generateStaticParams() {
  return (await getFirms()).map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = await getFirm((await params).slug)
  return f ? { title: f.name, description: f.summary } : {}
}

export default async function FirmPage({ params }: { params: Promise<{ slug: string }> }) {
  const f = await getFirm((await params).slug)
  if (!f) notFound()
  const related = (await getArticles()).filter((a) => a.firms?.includes(f.slug))
  return (
    <div className="wrap">
      <div className="page-head">
        <Link href="/directory" className="linkbtn">← Directory</Link>
        <br /><br />
        <span className={`tier ${f.tier}`}>{f.tier === 'free' ? 'Basic listing' : `${f.tier} listing`}</span>
        <h1 style={{ marginTop: 8 }}>{f.name}</h1>
        <p>{f.type} · {f.city} · {f.regions.join(', ')}</p>
      </div>
      <div className="home-grid">
        <div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 21 }}>{f.summary}</p>
          <div className="tags">{f.sectors.map((s) => <span key={s} className="pill">{s}</span>)}</div>
          <p className="meta" style={{ marginTop: 14 }}>
            {f.founded ? `Founded ${f.founded}. ` : ''}{f.size ? `${f.size}. ` : ''}
            {f.claimed ? <span className="badge-ver">✓ Verified by firm</span> : 'Profile compiled from public sources; not yet verified by the firm.'}
          </p>
          {related.length > 0 && <><div className="rule-head"><h2>In the news</h2></div><div className="stack">{related.map((a) => <Story key={a.slug} a={a} compact />)}</div></>}
        </div>
        <aside>
          {f.claimed ? (
            <div className="tile"><h3>Contact {f.name}</h3><EnquiryForm kind="firm-enquiry" target={f.slug} cta="Send enquiry" /></div>
          ) : (
            <section id="claim" className="claim">
              <h3>Is this your firm?</h3>
              <p>This profile was compiled from public sources. Claim it to correct details, add your logo and receive enquiries.</p>
              <div className="tiers" style={{ gridTemplateColumns: '1fr' }}>
                <div className="tcard hot"><b>Featured</b><span className="price">£1,500<small> / year</small></span></div>
                <div className="tcard"><b>Premium</b><span className="price">£4,500<small> / year</small></span></div>
              </div>
              <EnquiryForm kind="claim" target={f.slug} cta="Claim this listing" tone="brass" />
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
