import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsletterBand } from '@/components/newsletter-band'

export const metadata: Metadata = { title: 'Newsletter' }

export default function Newsletter() {
  return (
    <>
      <div className="wrap">
        <div className="page-head">
          <h1>Newsletter</h1>
          <p>A weekly digest of the stories, regulation and moves that matter to family wealth advisers.</p>
        </div>
        <div className="tile">
          <span className="kicker sponsored">Sponsor this newsletter</span>
          <h3>Primary sponsor, classified and solo-send placements</h3>
          <p className="meta">Reach advisers directly. <Link href="/advertise">See the rate card</Link></p>
        </div>
      </div>
      <NewsletterBand source="newsletter-page" />
    </>
  )
}
