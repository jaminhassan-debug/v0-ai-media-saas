import Link from 'next/link'
import { Ad } from '@/components/ad'
import { NewsletterBand } from '@/components/newsletter-band'
import { Story } from '@/components/story'
import { REGIONS, getArticles, regionSlug, type Region } from '@/lib/content'

export async function RegionPage({ region }: { region?: Region }) {
  const list = (await getArticles({ region })).filter((a) => a.kind === 'News' || a.kind === 'Partner insight')
  return (
    <>
      <div className="wrap">
        <div className="page-head">
          <h1>News{region ? ` · ${region}` : ''}</h1>
          <p>Developments across law, tax, regulation and wealth management.</p>
          <p className="row-links">
            <Link href="/news">All regions</Link>
            {REGIONS.map((x) => <Link key={x} href={`/region/${regionSlug(x)}`}>{x}</Link>)}
          </p>
        </div>
        <Ad size="leader" />
        <div className="home-grid">
          <div className="stack">{list.length ? list.map((a) => <Story key={a.slug} a={a} />) : <p>No stories yet for this region.</p>}</div>
          <aside>
            <Ad size="mpu" />
            <div className="tile paid" style={{ marginTop: 16 }}>
              <span className="kicker sponsored">Section sponsorship</span>
              <h3>Put your firm at the top of News</h3>
              <p className="meta">Own this section for a quarter, with a banner and first look on every story. <Link href="/advertise"><b>Rate card</b></Link></p>
            </div>
            <div className="tile" style={{ marginTop: 16 }}>
              <span className="kicker sponsored">Jobs</span>
              <h3>Hire in family wealth</h3>
              <p className="meta">Post a role to advisers reading daily. From £400 as a newsletter classified.</p>
            </div>
          </aside>
        </div>
      </div>
      <NewsletterBand source="news" />
    </>
  )
}
