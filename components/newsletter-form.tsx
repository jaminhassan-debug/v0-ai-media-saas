'use client'
import { useState } from 'react'
import { browserClient } from '@/lib/supabase'

export function NewsletterForm({ source = 'site' }: { source?: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle')
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    setState('busy')
    try {
      const db = browserClient()
      if (!db) throw new Error('Sign-up is not configured yet.')
      const { error } = await db.from('subscribers').insert({ email: String(email).trim().toLowerCase(), source })
      // 23505 = already subscribed; treat as success
      if (error && error.code !== '23505') throw new Error('Please enter a valid email address.')
      setState('ok')
      setMsg('Thanks \u2014 you are on the list.')
    } catch (err) {
      setState('err')
      setMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
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
