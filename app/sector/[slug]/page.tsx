import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Ad } from '@/components/ad'
import { FirmCard } from '@/components/firm-card'
import { NewsletterBand } from '@/components/newsletter-band'
import { Story } from '@/components/story'
import { TrackerTable } from '@/components/tracker-table'
import { SECTORS, getArticles, getFirms, getTracker, sectorNotes, sectorSlug } from '@/lib/content'

export const generateStaticParams = () => SECTORS.map((s) => ({ slug: sectorSlug(s) }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = SECTORS.find((x) => sectorSlug(x) === slug)
  return { title: s ? `${s} hub` : 'Sector' }
}

export default async function Sector({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sector = SECTORS.find((x) => sectorSlug(x) === slug)
  if (!sector) notFound()
  const [list, firms, tracker] = await Promise.all([getArticles({ sector }), getFirms(), getTracker()])
  const inSector = firms.filter((f) => f.sectors.includes(sector))
  const items = tracker.filter((t) => t.sector === sector)
  return (
    <>
      <div className="wrap">
        <div className="page-head"><h1>{sector}</h1><p>{sectorNotes[sector]}. Latest coverage, regulatory items and listed firms.</p></div>
        <Ad size="leader" />
        <div className="rule-head"><h2>Latest</h2></div>
        {list.length ? <div className="cols2">{list.map((a) => <Story key={a.slug} a={a} />)}</div> : <p>No stories yet.</p>}
        {items.length > 0 && <><div className="rule-head"><h2>Regulatory items</h2></div><TrackerTable items={items} /></>}
        <div className="rule-head"><h2>Firms</h2><span className="meta">Premium and Featured listings first</span></div>
        <div className="firms">{inSector.map((f) => <FirmCard key={f.slug} f={f} />)}</div>
        <div className="tile paid" style={{ marginTop: 28 }}>
          <span className="kicker sponsored">Sector sponsorship</span>
          <h3>Own the {sector} hub</h3>
          <p className="meta">Banner, newsletter mention and first look on every story for a quarter. <Link href="/advertise"><b>Rate card</b></Link></p>
        </div>
      </div>
      <NewsletterBand source="sector" />
    </>
  )
}
