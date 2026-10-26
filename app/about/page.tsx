import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function About() {
  return (
    <div className="wrap">
      <div className="page-head"><h1>About</h1><p>Family Wealth Intelligence is an independent information service for the advisers who serve wealthy families.</p></div>
      <div className="cols2" style={{ marginTop: 20 }}>
        <div className="tile"><h3>What we publish</h3><p className="meta">News, analysis, a firm directory, data and rankings, a regulatory tracker and events, across the UK, Europe, US and Asia.</p></div>
        <div className="tile"><h3>Editorial independence</h3><p className="meta">Sponsored and partner content is always labelled. Legal and tax articles are reviewed by a human editor before publication.</p></div>
      </div>
    </div>
  )
}
