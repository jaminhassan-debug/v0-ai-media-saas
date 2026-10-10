import type { Metadata } from 'next'
import { Ad } from '@/components/ad'
import { NewsletterBand } from '@/components/newsletter-band'
import { fmtDate, getTracker } from '@/lib/content'

export const metadata: Metadata = { title: 'Regulatory tracker' }

export default async function Tracker() {
  const items = await getTracker()
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Regulatory tracker</h1>
        <p>Consultations, proposals and guidance affecting private clients, trusts and family offices, by jurisdiction. Sample entries shown.</p>
      </div>
      <Ad size="leader" />
      <div className="table-scroll">
        <table className="tbl">
          <thead><tr><th>Date</th><th>Region</th><th>Issuer</th><th>Sector</th><th>Item</th><th>Status</th></tr></thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td>{fmtDate(t.date)}</td><td>{t.region}</td><td>{t.body}</td><td>{t.sector}</td><td>{t.title}</td>
                <td><span className={`pill ${t.status.toLowerCase().replace(' ', '-')}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="claim" style={{ marginTop: 24 }}>
        <h3>Alerts by jurisdiction</h3>
        <p>Subscribers get an email the day an item is added for the regions and sectors they choose.</p>
      </div>
      <NewsletterBand source="tracker" />
    </div>
  )
}
