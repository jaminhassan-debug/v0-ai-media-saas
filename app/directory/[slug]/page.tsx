import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Story } from '@/components/story'
import { EnquiryForm } from '@/components/enquiry-form'
import { firms, getArticles, getFirm } from '@/lib/content'

export const generateStaticParams = () => firms.map((f) => ({ slug: f.slug }))

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
        <span className={`tier ${f.tier}`}>{f.tier === 'free' ? 'Basic listing' : `${f.tier} listing`}</span>
        <h1>{f.name}</h1>
        <p>{f.type} · {f.city} · {f.regions.join(', ')}</p>
      </div>
      <div className="home-grid">
        <div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>{f.summary}</p>
          <div className="tags">{f.sectors.map((s) => <span key={s} className="pill">{s}</span>)}</div>
          {f.founded && <p className="meta" style={{ marginTop: 12 }}>Founded {f.founded}</p>}
          {related.length > 0 && (<><div className="rule-head"><h2>In the news</h2></div>{related.map((a) => <Story key={a.slug} a={a} compact />)}</>)}
        </div>
        <aside>
          {f.claimed ? (
            <div className="tile"><h3>Contact {f.name}</h3><EnquiryForm kind="firm-enquiry" target={f.slug} cta="Send enquiry" /></div>
          ) : (
            <section id="claim" className="claim">
              <h3>Is this your firm?</h3>
              <p>This profile was compiled from public sources. Claim it to correct details, add your logo and receive enquiries.</p>
              <Link className="btn brass" href={`/contact?topic=claim&firm=${f.slug}`}>Claim this listing</Link>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
