import type { Metadata } from 'next'
import Link from 'next/link'
import { Story } from '@/components/story'
import { getArticles } from '@/lib/content'

export const metadata: Metadata = { title: 'Analysis' }

export default async function Analysis() {
  const list = [...(await getArticles({ kind: 'Analysis' })), ...(await getArticles({ kind: 'Opinion' })), ...(await getArticles({ kind: 'Partner insight' }))]
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Analysis</h1>
        <p>In-depth reporting, opinion and partner insight. Some analysis is for subscribers.</p>
      </div>
      <div className="cols2">{list.map((a) => <Story key={a.slug} a={a} />)}</div>
      <div className="claim" style={{ marginTop: 28 }}>
        <h3>Get every analysis piece, plus alerts</h3>
        <p>Subscribers read unlimited analysis and receive regulatory alerts by jurisdiction.</p>
        <Link className="btn brass" href="/data#plans">See plans</Link>
      </div>
    </div>
  )
}
