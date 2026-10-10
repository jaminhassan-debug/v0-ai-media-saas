'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { EnquiryForm } from '@/components/enquiry-form'

const TITLES: Record<string, string> = { claim: 'Claim your listing', advertise: 'Advertise with us', subscribe: 'Subscribe' }

function ContactInner() {
  const params = useSearchParams()
  const topic = params.get('topic') ?? 'general'
  const firm = params.get('firm') ?? ''
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{TITLES[topic] ?? 'Contact us'}</h1>
        <p>Tell us a little about you and we will reply within one working day.</p>
      </div>
      <EnquiryForm kind="contact" topic={topic} target={firm} cta="Send" />
    </div>
  )
}

export default function Contact() {
  return (
    <Suspense fallback={null}>
      <ContactInner />
    </Suspense>
  )
}
