import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron, Noto_Sans_KR, Nanum_Myeongjo } from 'next/font/google'
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

const myeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  variable: '--font-myeongjo',
  weight: ['700', '800'],
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '여운 · 롤 디스코드 커뮤니티',
  description:
    '여운 — 리그 오브 레전드 내전 디스코드 서버. 매일 열리는 내전, 포인트 상점, 시즌 리그전.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0f1e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${orbitron.variable} ${notoKr.variable} ${myeongjo.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
          <p>
            여운 — League of Legends community. Not affiliated with Riot Games.
          </p>
        </footer>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
