import Link from 'next/link'
import { Ad } from '@/components/ad'
import { Story } from '@/components/story'
import { REGIONS, getArticles, type Region } from '@/lib/content'

export async function RegionPage({ region }: { region?: Region }) {
  const list = (await getArticles({ region })).filter((a) => a.kind !== 'Analysis')
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>News{region ? ` · ${region}` : ''}</h1>
        <p>Breaking developments across law, tax, regulation and wealth management.</p>
        <p>
          <Link href="/news">All regions</Link>
          {REGIONS.map((x) => <span key={x}> · <Link href={`/region/${x.toLowerCase()}`}>{x}</Link></span>)}
        </p>
      </div>
      <Ad size="leader" />
      <div className="home-grid">
        <div>{list.length ? list.map((a) => <Story key={a.slug} a={a} />) : <p>No stories yet for this region.</p>}</div>
        <aside>
          <Ad size="mpu" />
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
