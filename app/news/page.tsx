import type { Metadata } from 'next'
import { RegionPage } from '@/components/region-page'

export const metadata: Metadata = { title: 'News' }

export default function News() {
  return <RegionPage />
}
