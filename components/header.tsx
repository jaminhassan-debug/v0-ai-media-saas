import Link from 'next/link'
import { LogoMark } from './logo'
import { REGIONS, SECTORS, sectorSlug } from '@/lib/content'

const NAV = [
  ['News', '/news'],
  ['Analysis', '/analysis'],
  ['Directory', '/directory'],
  ['Data & Rankings', '/data'],
  ['Regulatory Tracker', '/tracker'],
  ['Events', '/events'],
  ['Newsletter', '/newsletter'],
  ['Advertise', '/advertise'],
] as const

export function Header() {
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <header>
      <a className="skip" href="#main">Skip to content</a>
      <div className="utility">
        <div className="wrap">
          <span>{today}</span>
          <span className="regions">
            {REGIONS.map((r) => (
              <Link key={r} href={`/region/${r.toLowerCase()}`}>{r}</Link>
            ))}
          </span>
        </div>
      </div>
      <div className="masthead">
        <div className="wrap">
          <Link href="/" className="logo">
            <LogoMark />
            <span className="logo-word">
              Family Wealth Intelligence
              <small>News · Analysis · Directory · Data</small>
            </span>
          </Link>
          <div className="mast-actions">
            <Link className="btn ghost small" href="/newsletter">Free newsletter</Link>
            <Link className="btn small" href="/data#plans">Subscribe</Link>
          </div>
        </div>
      </div>
      <nav className="nav" aria-label="Primary">
        <div className="wrap">
          <ul>
            {NAV.map(([label, href]) => (
              <li key={href}><Link href={href}>{label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="sectors">
          <div className="wrap">
            <ul>
              {SECTORS.map((s) => (
                <li key={s}><Link href={`/sector/${sectorSlug(s)}`}>{s}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
