'use client'
import { useState } from 'react'

export function EnquiryForm({ kind, target = '', cta = 'Send', topic = '' }: { kind: string; target?: string; cta?: string; topic?: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle')
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = Object.fromEntries(new FormData(e.currentTarget))
    setState('busy')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...fd, kind, target, topic }),
      })
      const data = await res.json()
      setState(res.ok ? 'ok' : 'err')
      setMsg(res.ok ? 'Thank you — we will be in touch.' : data.error ?? 'Something went wrong.')
    } catch {
      setState('err')
      setMsg('Network error. Please try again.')
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>Name<input name="name" required autoComplete="name" /></label>
      <label>Work email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Company<input name="company" autoComplete="organization" /></label>
      <label>Message<textarea name="message" rows={4} /></label>
      <button className="btn" disabled={state === 'busy'}>{state === 'busy' ? 'Sending…' : cta}</button>
      {msg && <p role="status" className="meta">{msg}</p>}
    </form>
  )
}
