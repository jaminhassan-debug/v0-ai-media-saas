'use client'
import { useMemo, useState } from 'react'
import { FirmCard } from './firm-card'
import { REGIONS, SECTORS, tierSort, type Firm } from '@/lib/content'

export function DirectoryExplorer({ firms }: { firms: Firm[] }) {
  const [q, setQ] = useState('')
  const [sector, setSector] = useState('')
  const [region, setRegion] = useState('')
  const [type, setType] = useState('')
  const [sort, setSort] = useState<'tier' | 'name'>('tier')
  const [verified, setVerified] = useState(false)
  const types = useMemo(() => [...new Set(firms.map((f) => f.type))].sort(), [firms])

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const list = firms.filter(
      (f) =>
        (!needle || `${f.name} ${f.city} ${f.type} ${f.summary}`.toLowerCase().includes(needle)) &&
        (!sector || f.sectors.includes(sector as Firm['sectors'][number])) &&
        (!region || f.regions.includes(region as Firm['regions'][number])) &&
        (!type || f.type === type) &&
        (!verified || f.claimed),
    )
    return list.sort(sort === 'name' ? (a, b) => a.name.localeCompare(b.name) : tierSort)
  }, [firms, q, sector, region, type, sort, verified])

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
        <label>Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as 'tier' | 'name')}>
            <option value="tier">Featured first</option>
            <option value="name">Name A to Z</option>
          </select>
        </label>
        <label className="chk"><input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />Verified only</label>
      </div>
      <p className="meta" aria-live="polite">{shown.length} {shown.length === 1 ? 'firm' : 'firms'}. {sort === 'tier' ? 'Premium and Featured listings appear first.' : 'Sorted by name.'}</p>
      <div className="firms">{shown.length ? shown.map((f) => <FirmCard key={f.slug} f={f} />) : <p>No firms match those filters.</p>}</div>
    </>
  )
}
