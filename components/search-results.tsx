'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FirmCard } from './firm-card'
import { Story } from './story'
import type { Article, Firm } from '@/lib/content'

function Inner({ articles, firms }: { articles: Article[]; firms: Firm[] }) {
  const q = (useSearchParams().get('q') ?? '').trim().toLowerCase()
  const a = q ? articles.filter((x) => `${x.title} ${x.standfirst} ${x.sector} ${x.region}`.toLowerCase().includes(q)) : []
  const f = q ? firms.filter((x) => `${x.name} ${x.summary} ${x.city} ${x.type}`.toLowerCase().includes(q)) : []
  return (
    <>
      <div className="page-head"><h1>Search</h1><p>{q ? `${a.length} articles and ${f.length} firms for “${q}”` : 'Type a term in the search box above.'}</p></div>
      {a.length > 0 && <><div className="rule-head"><h2>Articles</h2></div>{a.map((x) => <Story key={x.slug} a={x} />)}</>}
      {f.length > 0 && <><div className="rule-head"><h2>Firms</h2></div><div className="firms">{f.map((x) => <FirmCard key={x.slug} f={x} />)}</div></>}
    </>
  )
}

export function SearchResults(props: { articles: Article[]; firms: Firm[] }) {
  return <Suspense fallback={null}><Inner {...props} /></Suspense>
}
