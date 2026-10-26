import type { Metadata } from 'next'
import { Ad } from '@/components/ad'
import { DirectoryExplorer } from '@/components/directory-explorer'
import { EnquiryForm } from '@/components/enquiry-form'
import { getFirms } from '@/lib/content'

export const metadata: Metadata = { title: 'Directory of family wealth advisers' }

export default async function Directory() {
  const firms = await getFirms()
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Directory</h1>
        <p>Law firms, wealth managers, trustees, tax advisers and family offices serving wealthy families across the UK, Europe, US and Asia.</p>
      </div>
      <Ad size="leader" />
      <DirectoryExplorer firms={firms} />
      <section id="claim" className="claim" style={{ marginTop: 30 }}>
        <h3>Own a listing? Claim and upgrade it.</h3>
        <p>Every firm gets a basic profile compiled from public sources. Claim yours to verify details, receive enquiries and stand out.</p>
        <div className="tiers">
          <div className="tcard"><b>Basic</b><span className="price">Free</span><ul><li>Name, location and sectors</li><li>Claim to verify</li></ul></div>
          <div className="tcard hot"><b>Featured</b><span className="price">£1,500<small> / year</small></span><ul><li>Priority placement</li><li>Enquiry form on your profile</li><li>Logo and full profile</li></ul></div>
          <div className="tcard"><b>Premium</b><span className="price">£4,500<small> / year</small></span><ul><li>Top placement in sector hubs</li><li>Newsletter mentions</li><li>Articles linked to your profile</li></ul></div>
        </div>
        <p className="sample-note">Illustrative prices to confirm before issuing the rate card.</p>
        <EnquiryForm kind="claim" target="directory" cta="Request a claim call" tone="brass" />
      </section>
    </div>
  )
}
