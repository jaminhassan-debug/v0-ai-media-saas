import Link from 'next/link'
import { Ad } from '@/components/ad'
import { Story } from '@/components/story'
import { FirmCard } from '@/components/firm-card'
import { NewsletterBand } from '@/components/newsletter-band'
import { SECTORS, fmtDate, getArticles, getEvents, getFirms, getTracker, sectorSlug } from '@/lib/content'

export default async function Home() {
  const [all, firms, events, tracker] = await Promise.all([getArticles(), getFirms(), getEvents(), getTracker()])
  const lead = all.find((a) => a.kind === 'Analysis') ?? all[0]
  const rest = all.filter((a) => a.slug !== lead.slug)
  const secondary = rest.slice(0, 2)
  const latest = [...all].slice(0, 8)
  const spotlight = firms.filter((f) => f.tier !== 'free').slice(0, 2)

  return (
    <>
      <div className="ticker" aria-label="Regulatory headlines">
        <div className="wrap">
          {tracker.slice(0, 4).map((t) => (
            <span key={t.id}><b>{t.region}</b>{t.title}</span>
          ))}
        </div>
      </div>

      <div className="wrap">
        <Ad size="leader" />

        <div className="home-grid">
          <div>
            <article className="lead">
              <div className="lead-art" aria-hidden="true">{lead.sector} · {lead.region}</div>
              <span className="kicker">{lead.kind} · {lead.sector}</span>
              <h1><Link href={`/article/${lead.slug}`}>{lead.title}</Link></h1>
              <p className="standfirst">{lead.standfirst}</p>
              <span className="meta">{lead.author} · {fmtDate(lead.date)} · {lead.readMins} min read</span>
            </article>
            <div className="secondary">
              {secondary.map((a) => <Story key={a.slug} a={a} />)}
            </div>
          </div>

          <aside className="side">
            <h2>Latest</h2>
            <ul className="latest">
              {latest.map((a) => (
                <li key={a.slug}>
                  <Link href={`/article/${a.slug}`}>{a.title}</Link>
                  <span className="meta">{a.sector} · {a.region} · {fmtDate(a.date)}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 20 }}><Ad size="mpu" /></div>
          </aside>
        </div>

        <div className="rule-head"><h2>Regulatory tracker</h2><Link href="/tracker">Full tracker →</Link></div>
        <div className="table-scroll">
          <table className="tbl">
            <thead><tr><th>Date</th><th>Region</th><th>Issuer</th><th>Item</th><th>Status</th></tr></thead>
            <tbody>
              {tracker.slice(0, 5).map((t) => (
                <tr key={t.id}>
                  <td>{fmtDate(t.date)}</td><td>{t.region}</td><td>{t.body}</td><td>{t.title}</td>
                  <td><span className={`pill ${t.status.toLowerCase().replace(' ', '-')}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rule-head"><h2>Sectors</h2></div>
        <div className="sector-hubs">
          {SECTORS.map((s) => <Link key={s} className="hub" href={`/sector/${sectorSlug(s)}`}>{s}</Link>)}
        </div>

        <div className="rule-head"><h2>Directory spotlight</h2><Link href="/directory">Browse the directory →</Link></div>
        <div className="cols2">{spotlight.map((f) => <FirmCard key={f.slug} f={f} />)}</div>

        <div className="rule-head"><h2>Events &amp; CPD</h2><Link href="/events">All events →</Link></div>
        <div className="cols3">
          {events.slice(0, 3).map((e) => (
            <div className="tile" key={e.slug}>
              <span className="kicker">{e.kind}</span>
              <h3><Link href={`/events#${e.slug}`}>{e.title}</Link></h3>
              <span className="meta">{fmtDate(e.date)} · {e.city}</span>
            </div>
          ))}
        </div>
      </div>
      <NewsletterBand source="home" />
    </>
  )
}
