import type { Metadata } from 'next'
import Link from 'next/link'
import { fmtDate, getEvents } from '@/lib/content'

export const metadata: Metadata = { title: 'Events & CPD' }

export default async function Events() {
  const events = await getEvents()
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Events &amp; CPD</h1>
        <p>Webinars, invite-only roundtables and our annual summit. Dates are provisional.</p>
      </div>
      <div className="cols2">
        {events.map((e) => (
          <article className="tile" id={e.slug} key={e.slug}>
            <span className="kicker">{e.kind}</span>
            <h3>{e.title}</h3>
            <p className="meta">{fmtDate(e.date)} · {e.city}{e.cpdHours ? ` · ${e.cpdHours} CPD hour` : ''}{e.capacity ? ` · ${e.capacity} delegates` : ''}</p>
            <p>{e.blurb}</p>
            <Link className="btn small" href={`/contact?topic=event-${e.slug}`}>Register interest</Link>
          </article>
        ))}
      </div>
      <section className="claim" style={{ marginTop: 28 }}>
        <h3>Sponsor an event</h3>
        <p>Summit, roundtable and webinar sponsorship packages are available.</p>
        <Link className="btn brass" href="/advertise">See sponsorship options</Link>
      </section>
    </div>
  )
}
