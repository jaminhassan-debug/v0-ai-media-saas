import type { Metadata } from 'next'
import Link from 'next/link'
import { getRankings } from '@/lib/content'

export const metadata: Metadata = { title: 'Data & rankings' }

export default async function Data() {
  const rankings = await getRankings()
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Data &amp; rankings</h1>
        <p>Databases and rankings of advisers, family offices and regulation. Tables shown are illustrative samples.</p>
      </div>
      {rankings.map((r) => (
        <section key={r.slug} style={{ marginBottom: 28 }}>
          <div className="rule-head"><h2>{r.title}{r.premium && <span className="lock">PRO</span>}</h2></div>
          <p className="meta">{r.blurb}</p>
          <div className="table-scroll">
            <table className="tbl">
              <thead><tr><th>#</th><th>Name</th><th>Score / metric</th><th>Notes</th></tr></thead>
              <tbody>{r.rows.map((x) => <tr key={x.rank}><td>{x.rank}</td><td>{x.name}</td><td>{x.metric}</td><td>{x.note}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      ))}
      <section id="plans">
        <div className="rule-head"><h2>Plans</h2></div>
        <div className="tiers">
          <div className="tcard"><b>Reader</b><span className="price">Free</span><ul><li>News and newsletter</li><li>Directory</li><li>Limited analysis</li></ul></div>
          <div className="tcard hot"><b>Professional</b><span className="price">£395<small style={{ fontSize: 14 }}> / yr</small></span><ul><li>All analysis</li><li>Data downloads</li><li>Alerts by jurisdiction</li></ul><Link className="btn brass" href="/contact?topic=subscribe">Register interest</Link></div>
          <div className="tcard"><b>Firm licence</b><span className="price">From £2,500<small style={{ fontSize: 14 }}> / yr</small></span><ul><li>Team access</li><li>Custom alerts</li><li>Priority support</li></ul><Link className="btn ghost" href="/contact?topic=subscribe">Talk to us</Link></div>
        </div>
        <p className="sample-note">Illustrative prices to test with your market. Checkout is not enabled yet; plans currently collect interest.</p>
      </section>
    </div>
  )
}
