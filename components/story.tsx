import Link from 'next/link'
import { fmtDate, type Article } from '@/lib/content'

export function Story({ a, compact }: { a: Article; compact?: boolean }) {
  const sponsored = a.kind === 'Partner insight'
  return (
    <article className="story">
      <span className={`kicker ${sponsored ? 'sponsored' : ''}`}>
        {sponsored ? `Sponsored · ${a.sponsor}` : `${a.sector} · ${a.region}`}
      </span>
      <h3>
        <Link href={`/article/${a.slug}`}>{a.title}</Link>
        {a.premium && <span className="lock">PRO</span>}
      </h3>
      {!compact && <p>{a.standfirst}</p>}
      <span className="meta">{fmtDate(a.date)} · {a.readMins} min read</span>
    </article>
  )
}
