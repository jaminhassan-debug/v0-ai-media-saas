'use client'
import { useMemo, useState } from 'react'
import { TrackerTable } from './tracker-table'
import { REGIONS, SECTORS, type TrackerItem } from '@/lib/content'

const STATUSES = ['Consultation', 'Proposed', 'Guidance', 'In force']

export function TrackerExplorer({ items }: { items: TrackerItem[] }) {
  const [region, setRegion] = useState('')
  const [sector, setSector] = useState('')
  const [status, setStatus] = useState('')
  const shown = useMemo(
    () => items.filter((t) => (!region || t.region === region) && (!sector || t.sector === sector) && (!status || t.status === status)),
    [items, region, sector, status],
  )
  return (
    <>
      <div className="filters filters3">
        <label>Region<select value={region} onChange={(e) => setRegion(e.target.value)}><option value="">All regions</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></label>
        <label>Sector<select value={sector} onChange={(e) => setSector(e.target.value)}><option value="">All sectors</option>{SECTORS.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
      </div>
      <p className="meta" aria-live="polite">{shown.length} items</p>
      {shown.length ? <TrackerTable items={shown} /> : <p>No items match.</p>}
    </>
  )
}
