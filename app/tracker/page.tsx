import type { Metadata } from 'next'
import Link from 'next/link'
import { Ad } from '@/components/ad'
import { NewsletterBand } from '@/components/newsletter-band'
import { TrackerExplorer } from '@/components/tracker-explorer'
import { getTracker } from '@/lib/content'

export const metadata: Metadata = { title: 'Regulatory tracker' }

export default async function Tracker() {
  const items = await getTracker()
  return (
    <>
      <div className="wrap">
        <div className="page-head">
          <h1>Regulatory tracker</h1>
          <p>Consultations, proposals and guidance affecting private clients, trusts and family offices, by jurisdiction. Sample entries shown.</p>
        </div>
        <Ad size="leader" />
        <TrackerExplorer items={items} />
        <div className="claim" style={{ marginTop: 26 }}>
          <h3>Alerts by jurisdiction</h3>
          <p>Subscribers get an email the day an item is added for the regions and sectors they choose.</p>
          <Link className="btn brass" href="/data#plans">See plans</Link>
        </div>
        <div className="tile paid" style={{ marginTop: 16 }}>
          <span className="kicker sponsored">Tracker sponsor</span>
          <h3>Sponsor the regulatory tracker</h3>
          <p className="meta">One sponsor, one logo, read by every adviser tracking change. <Link href="/advertise"><b>Rate card</b></Link></p>
        </div>
      </div>
      <NewsletterBand source="tracker" />
    </>
  )
}
