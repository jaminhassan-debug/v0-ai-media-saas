import Link from 'next/link'
import { LogoMark } from './logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <LogoMark size={32} />
              <strong style={{ color: '#fff', fontFamily: 'var(--serif)', fontSize: 18 }}>Family Wealth Intelligence</strong>
            </div>
            <p>Independent news, analysis, directories and data for the advisers who serve wealthy families in the UK, Europe, US and Asia.</p>
          </div>
          <div>
            <h4>Read</h4>
            <ul>
              <li><Link href="/news">News</Link></li>
              <li><Link href="/analysis">Analysis</Link></li>
              <li><Link href="/tracker">Regulatory tracker</Link></li>
              <li><Link href="/newsletter">Newsletter</Link></li>
            </ul>
          </div>
          <div>
            <h4>Find</h4>
            <ul>
              <li><Link href="/directory">Directory</Link></li>
              <li><Link href="/data">Data &amp; rankings</Link></li>
              <li><Link href="/events">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4>Partner</h4>
            <ul>
              <li><Link href="/advertise">Advertise</Link></li>
              <li><Link href="/directory#claim">Claim your listing</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        <p className="legal">
          © {new Date().getFullYear()} Family Wealth Intelligence. Content is for information only and is not legal, tax or investment advice.
          Sponsored and partner content is labelled. Sample content on this site is placeholder data until launch.
        </p>
      </div>
    </footer>
  )
}
