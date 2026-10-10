import type { Metadata } from 'next'
import Link from 'next/link'
import { Ad } from '@/components/ad'
import { DirectoryExplorer } from '@/components/directory-explorer'
import { getFirms } from '@/lib/content'

export const metadata: Metadata = { title: 'Directory of family wealth advisers' }

export default async function Directory() {
  const firms = await getFirms()
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Directory</h1>
        <p>Find law firms, wealth managers, trustees, tax advisers and family offices across the UK, Europe, US and Asia.</p>
      </div>
      <Ad size="leader" />
      <DirectoryExplorer firms={firms} />
      <section id="claim" className="claim" style={{ marginTop: 28 }}>
        <h3>Own a listing? Claim and upgrade it.</h3>
        <p>Every firm gets a basic profile. Claim yours to verify details, receive enquiries and stand out.</p>
        <div className="tiers">
          <div className="tcard"><b>Basic</b><span className="price">Free</span><ul><li>Name, location, sectors</li><li>Claim to verify</li></ul></div>
          <div className="tcard hot"><b>Featured</b><span className="price">£1,500<small style={{ fontSize: 14 }}> / yr</small></span><ul><li>Priority placement</li><li>Enquiry form</li><li>Logo and full profile</li></ul></div>
          <div className="tcard"><b>Premium</b><span className="price">£4,500<small style={{ fontSize: 14 }}> / yr</small></span><ul><li>Top placement in sector hubs</li><li>Newsletter mentions</li><li>Articles linked to your profile</li></ul></div>
        </div>
        <p className="sample-note">Illustrative prices; confirm before publishing the rate card.</p>
        <Link className="btn brass" href="/contact?topic=claim">Claim a listing</Link>
      </section>
    </div>
  )
}
