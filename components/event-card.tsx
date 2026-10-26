'use client'
import { useState } from 'react'
import { EnquiryForm } from './enquiry-form'
import { fmtDate, type Event } from '@/lib/content'

export function EventCard({ e }: { e: Event }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="tile" id={e.slug}>
      <span className="kicker">{e.kind}</span>
      <h3>{e.title}</h3>
      <p className="meta">{fmtDate(e.date)} · {e.city}{e.cpdHours ? ` · ${e.cpdHours} CPD hour` : ''}{e.seats ? ` · ${e.seats} delegates` : ''}</p>
      <p>{e.blurb}</p>
      <button className="btn sm" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Close' : 'Register interest'}</button>
      {open && <div style={{ marginTop: 14 }}><EnquiryForm kind="event-interest" target={e.slug} cta="Register interest" message={false} /></div>}
    </article>
  )
}
