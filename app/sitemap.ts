import type { MetadataRoute } from 'next'
import { REGIONS, SECTORS, getArticles, getFirms, regionSlug, sectorSlug } from '@/lib/content'

export const dynamic = 'force-static'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://familywealthintelligence.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, firms] = await Promise.all([getArticles(), getFirms()])
  const fixed = ['', '/news', '/analysis', '/directory', '/data', '/tracker', '/events', '/newsletter', '/advertise', '/about', '/contact']
  return [
    ...fixed.map((p) => ({ url: `${SITE}${p}` })),
    ...SECTORS.map((s) => ({ url: `${SITE}/sector/${sectorSlug(s)}` })),
    ...REGIONS.map((r) => ({ url: `${SITE}/region/${regionSlug(r)}` })),
    ...articles.map((a) => ({ url: `${SITE}/article/${a.slug}`, lastModified: a.date })),
    ...firms.map((f) => ({ url: `${SITE}/directory/${f.slug}` })),
  ]
}
