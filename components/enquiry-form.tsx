'use client'
import { useState } from 'react'
import { browserClient } from '@/lib/supabase'

export function EnquiryForm({ kind, target = '', cta = 'Send', topic = '', message = true, tone = '' }: { kind: string; target?: string; cta?: string; topic?: string; message?: boolean; tone?: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle')
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = Object.fromEntries(new FormData(e.currentTarget))
    setState('busy')
    try {
      const db = browserClient()
      if (!db) throw new Error('Enquiries are not configured yet.')
      const f = fd as Record<string, string>
      const { error } = await db.from('enquiries').insert({
        kind, topic, target, name: f.name, email: f.email, company: f.company, message: f.message,
      })
      if (error) throw new Error('Could not send your message. Please check your details and try again.')
      setState('ok')
      setMsg('Thank you \u2014 we will be in touch.')
    } catch (err) {
      setState('err')
      setMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>Name<input name="name" required autoComplete="name" /></label>
      <label>Work email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Company<input name="company" autoComplete="organization" /></label>
      {message && <label>Message<textarea name="message" rows={4} /></label>}
      <button className={`btn ${tone}`} disabled={state === 'busy'}>{state === 'busy' ? 'Sending…' : cta}</button>
      {msg && <p role="status" className="meta">{msg}</p>}
    </form>
  )
}
