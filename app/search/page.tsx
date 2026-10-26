import type { Metadata } from 'next'
import { SearchResults } from '@/components/search-results'
import { getArticles, getFirms } from '@/lib/content'

export const metadata: Metadata = { title: 'Search' }

export default async function Search() {
  const [articles, firms] = await Promise.all([getArticles(), getFirms()])
  return <div className="wrap"><SearchResults articles={articles} firms={firms} /></div>
}
