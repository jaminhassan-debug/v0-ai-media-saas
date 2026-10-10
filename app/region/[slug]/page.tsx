import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RegionPage } from '@/components/region-page'
import { REGIONS } from '@/lib/content'

const slugOf = (r: string) => r.toLowerCase()

export const generateStaticParams = () => REGIONS.map((r) => ({ slug: slugOf(r) }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const r = REGIONS.find((x) => slugOf(x) === slug)
  return { title: r ? `News · ${r}` : 'News' }
}

export default async function Region({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const region = REGIONS.find((x) => slugOf(x) === slug)
  if (!region) notFound()
  return <RegionPage region={region} />
}
