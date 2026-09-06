import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron, Noto_Sans_KR } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-kr',
  weight: ['400', '500', '700'],
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LoL-Iter League · 롤이터',
  description:
    'LoL-Iter — the inner-league community for League of Legends. Live streams, brackets, player cards, transfer market, scrims and more.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#090A0F',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${orbitron.variable} ${notoKr.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
          <p>
            LoL-Iter League · 롤이터 — Community inner-league. Not affiliated with Riot Games.
          </p>
        </footer>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
