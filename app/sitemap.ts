import type { MetadataRoute } from 'next'
import { articles, firms, SECTORS, sectorSlug } from '@/lib/content'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://familywealthintelligence.com'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ['', '/news', '/analysis', '/directory', '/data', '/tracker', '/events', '/newsletter', '/advertise', '/contact']
  return [
    ...fixed.map((p) => ({ url: `${SITE}${p}` })),
    ...SECTORS.map((s) => ({ url: `${SITE}/sector/${sectorSlug(s)}` })),
    ...articles.map((a) => ({ url: `${SITE}/article/${a.slug}`, lastModified: a.date })),
    ...firms.map((f) => ({ url: `${SITE}/directory/${f.slug}` })),
  ]
}
