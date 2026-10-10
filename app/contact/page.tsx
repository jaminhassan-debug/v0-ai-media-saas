import type { Metadata } from 'next'
import { EnquiryForm } from '@/components/enquiry-form'

export const metadata: Metadata = { title: 'Contact' }

export default async function Contact({ searchParams }: { searchParams: Promise<{ topic?: string; firm?: string }> }) {
  const { topic = 'general', firm = '' } = await searchParams
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{topic === 'claim' ? 'Claim your listing' : topic === 'advertise' ? 'Advertise with us' : 'Contact us'}</h1>
        <p>Tell us a little about you and we will reply within one working day.</p>
      </div>
      <EnquiryForm kind="contact" topic={topic} target={firm} cta="Send" />
    </div>
  )
}
