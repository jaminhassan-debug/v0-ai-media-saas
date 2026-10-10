import Link from 'next/link'
import type { Firm } from '@/lib/content'

export function FirmCard({ f }: { f: Firm }) {
  return (
    <article className={`firm ${f.tier}`}>
      <span className={`tier ${f.tier}`}>{f.tier === 'free' ? 'Basic listing' : f.tier}</span>
      <h3><Link href={`/directory/${f.slug}`}>{f.name}</Link></h3>
      <span className="meta">{f.type} · {f.city}</span>
      <p style={{ margin: 0, fontSize: 15 }}>{f.summary}</p>
      <div className="tags">
        {f.sectors.map((s) => <span key={s} className="pill">{s}</span>)}
        {f.regions.map((r) => <span key={r} className="pill">{r}</span>)}
      </div>
      {f.claimed ? <span className="badge-ver">✓ Verified by firm</span> : <Link className="meta" href={`/directory/${f.slug}#claim`}>Is this your firm? Claim listing →</Link>}
    </article>
  )
}
