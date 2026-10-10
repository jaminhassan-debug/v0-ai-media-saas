import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://familywealthintelligence.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Family Wealth Intelligence', template: '%s | Family Wealth Intelligence' },
  description:
    'News, analysis, directories and data for the lawyers, wealth managers, trustees and advisers who serve wealthy families in the UK, Europe, US and Asia.',
  openGraph: { siteName: 'Family Wealth Intelligence', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&family=Public+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
