import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsletterPrefs } from '@/components/newsletter-prefs'

export const metadata: Metadata = { title: 'Newsletter' }

export default function Newsletter() {
  return (
    <div className="wrap">
      <div className="page-head"><h1>Newsletter</h1><p>A weekly digest of the stories, regulation and moves that matter to family wealth advisers. Choose what you want to see.</p></div>
      <div className="home-grid">
        <NewsletterPrefs />
        <aside>
          <div className="tile paid">
            <span className="kicker sponsored">Sponsor this newsletter</span>
            <h3>Reach advisers directly</h3>
            <ul style={{ paddingLeft: 18, fontSize: 14 }}><li>Primary sponsor, £1,200 per issue</li><li>Classified slot, £400 per issue</li><li>Solo send to the full list</li></ul>
            <Link className="btn small brass" href="/advertise">Rate card</Link>
          </div>
        </aside>
      </div>
      <div className="rule-head"><h2>What a Friday issue contains</h2></div>
      <div className="cols3">
        <div className="tile"><h3>The week’s lead</h3><p className="meta">One analysis piece and four headlines.</p></div>
        <div className="tile"><h3>Regulatory changes</h3><p className="meta">New tracker items for your jurisdictions.</p></div>
        <div className="tile"><h3>People and firms</h3><p className="meta">Appointments, listings and events.</p></div>
      </div>
    </div>
  )
}
