import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Motion from '@/components/Motion'
import BackToTop from '@/components/BackToTop'
import { site } from '@/lib/site'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.grandmarkca.com'),
  title: {
    default: 'GRANDMARK & ASSOCIATES — One of India’s Leading CA Firms',
    template: '%s | GRANDMARK & ASSOCIATES',
  },
  description:
    'More than 750 man-years of experience. 18 Partners, 14 Offices across India. Access to 100 plus professional experts and advisers across Indian and overseas.',
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'GRANDMARK & ASSOCIATES — One of India’s Leading CA Firms',
    description:
      '18 Partners, 14 Offices across India. Audits, Taxation, Accounting, Valuation, Merger & Acquisition and Corporate Compliance since 1991.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        {/*
          Arm the animation styles before first paint, but only when motion is
          welcome — so reduced-motion visitors never see hidden elements, and a
          JS failure leaves the page fully readable.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('gm-anim')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Motion />
        <BackToTop />
      </body>
    </html>
  )
}
