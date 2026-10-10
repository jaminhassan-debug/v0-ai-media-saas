'use client'
import { useState } from 'react'

export function NewsletterForm({ source = 'site' }: { source?: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle')
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    setState('busy')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = await res.json()
      setState(res.ok ? 'ok' : 'err')
      setMsg(res.ok ? 'Thanks — you are on the list.' : data.error ?? 'Something went wrong.')
    } catch {
      setState('err')
      setMsg('Network error. Please try again.')
    }
  }

  return (
    <form className="news-form" onSubmit={onSubmit}>
      <label className="skip" htmlFor={`email-${source}`}>Email address</label>
      <input id={`email-${source}`} name="email" type="email" required placeholder="Work email address" autoComplete="email" />
      <button className="btn brass" disabled={state === 'busy'}>{state === 'busy' ? 'Sending…' : 'Subscribe free'}</button>
      {msg && <span className="msg" role="status">{msg}</span>}
    </form>
  )
}
