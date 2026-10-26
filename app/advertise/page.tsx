import type { Metadata } from 'next'
import { EnquiryForm } from '@/components/enquiry-form'
import { products } from '@/lib/content'

export const metadata: Metadata = { title: 'Advertise' }

export default function Advertise() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Advertise with Family Wealth Intelligence</h1>
        <p>Reach the lawyers, trustees, wealth managers and family offices who advise wealthy families in the UK, Europe, US and Asia.</p>
      </div>
      <div className="claim" style={{ marginTop: 20 }}>
        <h3>Founding partner offer</h3>
        <p>A limited number of founding partners receive discounted annual packages and priority placement at launch, in return for an annual commitment.</p>
      </div>
      <div className="cols3" style={{ marginTop: 24 }}>
        <div className="tile"><span className="kicker">Audience</span><h3>Advisers, not consumers</h3><p className="meta">Private client lawyers, tax advisers, trustees, wealth managers and family office executives.</p></div>
        <div className="tile"><span className="kicker">Regions</span><h3>UK first, then global</h3><p className="meta">UK from launch, Europe from month seven, US and Asia from month ten.</p></div>
        <div className="tile"><span className="kicker">Format</span><h3>Labelled and clear</h3><p className="meta">All sponsored content is labelled. Editorial stays independent.</p></div>
      </div>
      <div className="rule-head"><h2>Rate card</h2><span className="meta">Illustrative starting prices</span></div>
      <div className="table-scroll">
        <table className="tbl">
          <thead><tr><th>Product</th><th>From</th><th>Includes</th></tr></thead>
          <tbody>{products.map((p) => <tr key={p.name}><td><b>{p.name}</b></td><td className="num">{p.price}</td><td>{p.includes}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="sample-note">Confirm every price against your market before issuing a media pack.</p>
      <div className="rule-head"><h2>Request the media pack</h2></div>
      <EnquiryForm kind="media-pack" target="advertise" cta="Request media pack" tone="brass" />
    </div>
  )
}
