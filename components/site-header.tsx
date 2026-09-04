'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Swords,
  Radio,
  CalendarDays,
  IdCard,
  ArrowLeftRight,
  History,
  Users,
  BookOpen,
  Menu,
  X,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const NAV = [
  { href: '/', label: '홈 / 실시간', icon: Radio },
  { href: '/schedule', label: '경기 일정 및 대진표', icon: CalendarDays },
  { href: '/teams', label: '참가 팀', icon: Users },
  { href: '/shop', label: '선수 카드 & 상점', icon: IdCard },
  { href: '/transfer', label: '이적 시장 & FA', icon: ArrowLeftRight },
  { href: '/history', label: '매치 전적', icon: History },
  { href: '/scrim', label: '스크림 현황', icon: Users },
  { href: '/rules', label: '규정 및 FAQ', icon: BookOpen },
]

interface DiscordUser {
  id: string
  username: string
  avatar: string
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // 컴포넌트 마운트 완료 체크 (하이드레이션 에러 방지)
  useEffect(() => {
    setIsMounted(true)

    const cookies = document.cookie.split(';')
    const userCookie = cookies.find((c) => c.trim().startsWith('discord_user='))
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
        setUser(userData)

        // 🛡️ Supabase에서 해당 유저의 관리자 권한(is_admin) 체크
        const checkAdmin = async () => {
          const { data, error } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', userData.id)
            .single()

          if (data && !error) {
            setIsAdmin(!!data.is_admin)
          }
        }
        checkAdmin()
      } catch (e) {
        console.error('유저 정보 파싱 에러', e)
      }
    }
  }, [])

  // 로그아웃 (쿠키 삭제 후 새로고침)
  const handleLogout = () => {
    document.cookie = 'discord_user=; Max-Age=0; path=/;'
    setUser(null)
    setIsAdmin(false)
    window.location.href = '/'
  }

  // 디스코드 로그인 페이지로 이동
  const handleDiscordLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

    const discordLoginUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri || '',
    )}&response_type=code&scope=identify%20guilds`

    window.location.href = discordLoginUrl
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid size-9 place-items-center rounded-lg border border-cyan/40 bg-cyan/10 neon-cyan-glow">
            <Swords className="size-5 text-cyan" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-base font-extrabold uppercase tracking-tight text-glow-cyan">
              LoL-Eiter
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              League · 롤이터
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => {
            const active = isMounted && pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors',
                  active
                    ? 'bg-cyan/10 text-cyan'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User bar & Admin Badge */}
        <div className="flex items-center gap-3">
          {/* 🛡️ 관리자 계정일 때만 모든 페이지 상단에 띄워지는 황금빛 마스터 배지 */}
          {isMounted && isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-gold animate-pulse shadow-[0_0_12px_rgba(250,204,21,0.3)] transition-transform hover:scale-105"
            >
              <ShieldCheck className="size-4" />
              <span>ADMIN MASTER</span>
            </Link>
          )}

          {isMounted && user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/mypage"
                className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-white/5 px-3 py-1.5 transition-colors hover:border-cyan/40 hover:bg-white/10"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="size-8 rounded-lg object-cover shrink-0"
                />
                <span className="text-xs font-bold tracking-tight text-foreground truncate max-w-[120px]">
                  {user.username}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="로그아웃"
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/80 bg-white/5 text-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : isMounted ? (
            <button
              onClick={handleDiscordLogin}
              className="flex items-center gap-2 rounded-lg bg-[#5865F2] px-3 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(88,101,242,0.8)]"
            >
              <LogIn className="size-4" />
              <span className="hidden sm:inline">Discord Login / Join Server</span>
              <span className="sm:hidden">Login</span>
            </button>
          ) : (
            <div className="w-[100px] h-9" /> // SSR 로딩 빈 공간 유지
          )}

          <button
            className="grid size-9 place-items-center rounded-lg border border-border bg-white/5 xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* 📱 모바일 화면 전용 드롭다운 메뉴 (open 상태일 때만 표시) */}
      {open && (
        <div className="border-t border-border/70 bg-background/95 px-4 py-4 backdrop-blur-2xl xl:hidden">
          <nav className="flex flex-col gap-1.5">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg border border-gold/50 bg-gold/15 px-3 py-2.5 text-xs font-extrabold uppercase tracking-widest text-gold mb-2"
              >
                <ShieldCheck className="size-4" />
                <span>ADMIN MASTER</span>
              </Link>
            )}
            {NAV.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors',
                    active
                      ? 'bg-cyan/10 text-cyan'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}