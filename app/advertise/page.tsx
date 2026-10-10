import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Advertise' }

const products: [string, string, string][] = [
  ['Directory listing — Featured', '£1,500 / yr', 'Priority placement, enquiry form, full profile'],
  ['Directory listing — Premium', '£4,500 / yr', 'Top placement, newsletter mentions, linked articles'],
  ['Newsletter primary sponsor', '£1,200 / issue', 'Top slot and logo in the weekly digest'],
  ['Newsletter classified', '£400 / issue', 'Short text placement'],
  ['Display advertising', '£35 CPM', 'Leaderboard and MPU across the site'],
  ['Section sponsorship', '£6,000 / quarter', 'Own News, Analysis or a sector hub'],
  ['Sponsored content', '£3,500 each', 'Labelled partner insight article'],
  ['Report sponsorship', '£8,000+', 'Sponsor a ranking or research report'],
  ['CPD webinar sponsorship', '£2,500', 'Co-hosted CPD session'],
  ['Summit sponsorship', '£4,000 – £20,000', 'Packages at the annual London summit'],
]

export default function Advertise() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Advertise with Family Wealth Intelligence</h1>
        <p>Reach the lawyers, trustees, wealth managers and family offices who advise wealthy families.</p>
      </div>
      <div className="claim">
        <h3>Founding partner offer</h3>
        <p>A limited number of founding partners receive discounted annual packages and priority placement at launch.</p>
        <Link className="btn brass" href="/contact?topic=advertise">Request the media pack</Link>
      </div>
      <div className="rule-head"><h2>Rate card</h2></div>
      <div className="table-scroll">
        <table className="tbl">
          <thead><tr><th>Product</th><th>From</th><th>Includes</th></tr></thead>
          <tbody>{products.map(([n, p, d]) => <tr key={n}><td><b>{n}</b></td><td>{p}</td><td>{d}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="sample-note">Illustrative starting prices for testing against your market. Confirm before issuing a media pack.</p>
    </div>
  )
}
