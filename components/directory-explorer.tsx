'use client'
import { useMemo, useState } from 'react'
import { FirmCard } from './firm-card'
import { REGIONS, SECTORS, type Firm } from '@/lib/content'

export function DirectoryExplorer({ firms }: { firms: Firm[] }) {
  const [q, setQ] = useState('')
  const [sector, setSector] = useState('')
  const [region, setRegion] = useState('')
  const [verified, setVerified] = useState(false)

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return firms.filter(
      (f) =>
        (!needle || `${f.name} ${f.city} ${f.type} ${f.summary}`.toLowerCase().includes(needle)) &&
        (!sector || f.sectors.includes(sector as Firm['sectors'][number])) &&
        (!region || f.regions.includes(region as Firm['regions'][number])) &&
        (!verified || f.claimed),
    )
  }, [firms, q, sector, region, verified])

  return (
    <>
      <div className="filters" role="search">
        <label>Search<input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Firm, city or specialism" /></label>
        <label>Sector
          <select value={sector} onChange={(e) => setSector(e.target.value)}>
            <option value="">All sectors</option>
            {SECTORS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>Region
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">All regions</option>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
        <label className="check"><input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />Verified only</label>
      </div>
      <p className="meta" aria-live="polite">{shown.length} {shown.length === 1 ? 'firm' : 'firms'}. Premium and Featured listings appear first.</p>
      <div className="firms">{shown.map((f) => <FirmCard key={f.slug} f={f} />)}</div>
    </>
  )
}
