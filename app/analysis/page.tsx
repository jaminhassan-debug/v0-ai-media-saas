import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsletterBand } from '@/components/newsletter-band'
import { Story } from '@/components/story'
import { getArticles } from '@/lib/content'

export const metadata: Metadata = { title: 'Analysis' }

export default async function Analysis() {
  const list = await getArticles({ kinds: ['Analysis', 'Opinion', 'Partner insight'] })
  return (
    <>
      <div className="wrap">
        <div className="page-head"><h1>Analysis</h1><p>In-depth reporting, opinion and partner insight. Pieces marked PRO are for subscribers.</p></div>
        <div className="cols2" style={{ marginTop: 20 }}>{list.map((a) => <Story key={a.slug} a={a} />)}</div>
        <div className="claim" style={{ marginTop: 30 }}>
          <h3>Read every analysis piece, with alerts</h3>
          <p>Subscribers get unlimited analysis, data downloads and regulatory alerts for their jurisdictions.</p>
          <Link className="btn brass" href="/data#plans">See plans</Link>
        </div>
      </div>
      <NewsletterBand source="analysis" />
    </>
  )
}
