import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Ad } from '@/components/ad'
import { FirmCard } from '@/components/firm-card'
import { Story } from '@/components/story'
import { SECTORS, getArticles, getFirms, sectorSlug } from '@/lib/content'

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
  const [list, firms] = await Promise.all([getArticles({ sector }), getFirms()])
  const inSector = firms.filter((f) => f.sectors.includes(sector))
  return (
    <div className="wrap">
      <div className="page-head"><h1>{sector}</h1><p>Latest coverage and listed firms in {sector.toLowerCase()}.</p></div>
      <Ad size="leader" />
      <div className="rule-head"><h2>Latest</h2></div>
      {list.length ? list.map((a) => <Story key={a.slug} a={a} />) : <p>No stories yet.</p>}
      <div className="rule-head"><h2>Firms</h2></div>
      <div className="cols2">{inSector.map((f) => <FirmCard key={f.slug} f={f} />)}</div>
    </div>
  )
}
