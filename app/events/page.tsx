import type { Metadata } from 'next'
import Link from 'next/link'
import { EventCard } from '@/components/event-card'
import { NewsletterBand } from '@/components/newsletter-band'
import { getEvents } from '@/lib/content'

export const metadata: Metadata = { title: 'Events & CPD' }

const GROUPS = [
  ['Summit', 'Flagship summit'],
  ['Roundtable', 'Roundtables'],
  ['CPD webinar', 'CPD webinars'],
] as const

export default async function Events() {
  const events = await getEvents()
  return (
    <>
      <div className="wrap">
        <div className="page-head"><h1>Events &amp; CPD</h1><p>Webinars with CPD hours, invite-only roundtables and our annual London summit. Dates are provisional.</p></div>
        {GROUPS.map(([kind, title]) => (
          <section key={kind}>
            <div className="rule-head"><h2>{title}</h2></div>
            <div className="cols2">{events.filter((e) => e.kind === kind).map((e) => <EventCard key={e.slug} e={e} />)}</div>
          </section>
        ))}
        <div className="rule-head"><h2>Sponsor an event</h2></div>
        <div className="tiers">
          <div className="tcard"><b>Webinar partner</b><span className="price">£2,500</span><ul><li>Speaker slot</li><li>Opt-in attendee list</li><li>CPD co-branding</li></ul></div>
          <div className="tcard hot"><b>Roundtable host</b><span className="price">£8,000</span><ul><li>Choose the theme</li><li>Host the closed session</li><li>Write-up with your name</li></ul></div>
          <div className="tcard"><b>Summit sponsor</b><span className="price">£4,000 to £20,000</span><ul><li>Packages by tier</li><li>Panel and stand options</li><li>Delegate tickets included</li></ul></div>
        </div>
        <p className="sample-note">Illustrative prices. Delegate ticket pricing to be set once the summit venue is confirmed.</p>
        <Link className="btn brass" href="/advertise">Talk to us about sponsorship</Link>
      </div>
      <NewsletterBand source="events" />
    </>
  )
}
