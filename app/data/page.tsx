import type { Metadata } from 'next'
import Link from 'next/link'
import { EnquiryForm } from '@/components/enquiry-form'
import { getRankings } from '@/lib/content'

export const metadata: Metadata = { title: 'Data & rankings' }

export default async function Data() {
  const rankings = await getRankings()
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Data &amp; rankings</h1>
        <p>Databases and rankings of advisers, family offices and regulation. Tables shown are illustrative samples; real rankings will publish with a methodology.</p>
      </div>
      <div className="cols3" style={{ marginTop: 16 }}>
        <Link className="tile" href="/directory"><span className="kicker">Database 1</span><h3>Family office &amp; adviser directory</h3><p className="meta">Searchable profiles by sector, region and type.</p></Link>
        <Link className="tile" href="/directory"><span className="kicker">Database 2</span><h3>Advisers by jurisdiction</h3><p className="meta">Counts of listed firms by country and discipline (below).</p></Link>
        <Link className="tile" href="/tracker"><span className="kicker">Database 3</span><h3>Regulatory tracker</h3><p className="meta">Consultations, proposals and guidance by jurisdiction.</p></Link>
      </div>
      {rankings.map((r) => (
        <section key={r.slug} style={{ marginTop: 28 }}>
          <div className="rule-head" style={{ marginTop: 0 }}><h2>{r.title}{r.premium && <span className="pro">PRO</span>}</h2><span className="meta">{r.region} · sample</span></div>
          <div className="table-scroll">
            <table className="tbl">
              <thead><tr>{r.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{r.rows.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j} className={`num${r.premium && j > 1 ? ' blur' : ''}`}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          {r.premium && <p className="meta">Full dataset and CSV download for subscribers.</p>}
        </section>
      ))}
      <div className="tile paid" style={{ marginTop: 28 }}>
        <span className="kicker sponsored">Report sponsorship</span>
        <h3>Sponsor a ranking or report</h3>
        <p className="meta">Put your name on the research advisers cite. From £8,000. <Link href="/advertise"><b>Details</b></Link></p>
      </div>
      <section id="plans">
        <div className="rule-head"><h2>Plans</h2></div>
        <div className="tiers">
          <div className="tcard"><b>Reader</b><span className="price">Free</span><ul><li>News and newsletter</li><li>Directory</li><li>Limited analysis</li></ul></div>
          <div className="tcard hot"><b>Professional</b><span className="price">£395<small> / year</small></span><ul><li>All analysis</li><li>Data downloads</li><li>Alerts by jurisdiction</li></ul></div>
          <div className="tcard"><b>Firm licence</b><span className="price">From £2,500<small> / year</small></span><ul><li>Team access</li><li>Custom alerts</li><li>Priority support</li></ul></div>
        </div>
        <p className="sample-note">Illustrative prices to test with your market. Checkout is not live; the form below collects interest.</p>
        <EnquiryForm kind="subscribe-interest" target="plans" cta="Register interest" message={false} tone="brass" />
      </section>
    </div>
  )
}
