import type { Metadata } from 'next'
import Link from 'next/link'
import { Ad } from '@/components/ad'
import { Story } from '@/components/story'
import { REGIONS, getArticles, type Region } from '@/lib/content'

export const metadata: Metadata = { title: 'News' }

export default async function News({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const { region } = await searchParams
  const r = REGIONS.find((x) => x === region) as Region | undefined
  const list = (await getArticles({ region: r })).filter((a) => a.kind !== 'Analysis')
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>News{r ? ` · ${r}` : ''}</h1>
        <p>Breaking developments across law, tax, regulation and wealth management.</p>
        <p>
          <Link href="/news">All regions</Link>{REGIONS.map((x) => <span key={x}> · <Link href={`/news?region=${x}`}>{x}</Link></span>)}
        </p>
      </div>
      <Ad size="leader" />
      <div className="home-grid">
        <div>{list.length ? list.map((a) => <Story key={a.slug} a={a} />) : <p>No stories yet for this region.</p>}</div>
        <aside><Ad size="mpu" />
          <div className="tile" style={{ marginTop: 16 }}>
            <span className="kicker sponsored">Section sponsorship</span>
            <h3>Put your firm at the top of News</h3>
            <p className="meta">Own this section for a quarter. <Link href="/advertise">Details</Link></p>
          </div>
        </aside>
      </div>
    </div>
  )
}
