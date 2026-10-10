import Link from 'next/link'

// Sellable ad slots. Replace the inner content with the advertiser's creative
// (or an ad-server tag) once a campaign is booked.
export function Ad({ size = 'leader' }: { size?: 'leader' | 'mpu' }) {
  return (
    <aside className={`ad ${size}`} aria-label="Advertisement">
      <strong>Advertisement</strong>
      {size === 'leader' ? '970 × 90 leaderboard' : '300 × 250 MPU'} — available to book.{' '}
      <Link href="/advertise">See the rate card</Link>
    </aside>
  )
}
