'use client'
import { useState } from 'react'
import { browserClient } from '@/lib/supabase'
import { REGIONS, SECTORS } from '@/lib/content'

export function NewsletterPrefs() {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle')
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') ?? '').trim().toLowerCase()
    setState('busy')
    try {
      const db = browserClient()
      if (!db) throw new Error('Sign-up is not configured yet.')
      const prefs = { regions: fd.getAll('region'), sectors: fd.getAll('sector'), frequency: fd.get('freq') }
      const { error } = await db.from('subscribers').insert({ email, source: 'newsletter-page', prefs })
      if (error && error.code !== '23505') throw new Error('Please enter a valid email address.')
      setState('ok')
      setMsg('Thanks — you are on the list.')
    } catch (err) {
      setState('err')
      setMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>Work email<input id="np-email" name="email" type="email" required autoComplete="email" /></label>
      <fieldset className="fs"><legend className="meta">Regions</legend>
        <div className="checks">{REGIONS.map((r) => <label key={r} className="chk"><input type="checkbox" name="region" value={r} defaultChecked />{r}</label>)}</div>
      </fieldset>
      <fieldset className="fs"><legend className="meta">Sectors</legend>
        <div className="checks">{SECTORS.map((s) => <label key={s} className="chk"><input type="checkbox" name="sector" value={s} />{s}</label>)}</div>
      </fieldset>
      <label>Frequency
        <select name="freq"><option value="weekly">Weekly digest (Friday)</option><option value="daily">Daily headlines</option></select>
      </label>
      <button className="btn brass" disabled={state === 'busy'}>{state === 'busy' ? 'Sending…' : 'Subscribe free'}</button>
      {msg && <p role="status" className={state === 'ok' ? 'form-ok' : 'meta'}>{msg}</p>}
    </form>
  )
}
