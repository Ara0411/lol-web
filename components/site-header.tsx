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
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const NAV = [
  { href: '/', label: '홈 / 실시간', icon: Radio, comingSoon: false },
  { href: '/schedule', label: '경기 일정 및 대진표', icon: CalendarDays, comingSoon: true },
  { href: '/teams', label: '참가 팀', icon: Users, comingSoon: false },
  { href: '/shop', label: '선수 카드 & 상점', icon: IdCard, comingSoon: false },
  { href: '/transfer', label: '이적 시장 & FA', icon: ArrowLeftRight, comingSoon: true },
  { href: '/history', label: '매치 전적', icon: History, comingSoon: true },
  { href: '/scrim', label: '스크림 현황', icon: Users, comingSoon: true },
  { href: '/rules', label: '규정 및 FAQ', icon: BookOpen, comingSoon: false },
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
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    setIsMounted(true)

    // 테마 초기 설정 확인 (로컬스토리지 또는 기본 다크모드)
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (storedTheme === 'light' || (!storedTheme && !prefersDark)) {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    } else {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    const cookies = document.cookie.split(';')
    const userCookie = cookies.find((c) => c.trim().startsWith('discord_user='))
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
        setUser(userData)

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

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
    }
  }

  const handleLogout = () => {
    document.cookie = 'discord_user=; Max-Age=0; path=/;'
    setUser(null)
    setIsAdmin(false)
    window.location.href = '/'
  }

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
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid size-9 place-items-center rounded-lg border border-cyan/40 bg-cyan/10 neon-cyan-glow">
            <Swords className="size-5 text-cyan" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-base font-extrabold uppercase tracking-tight text-glow-cyan">
              LoL-Eiter
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              League · 롤이터
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 2xl:gap-1 xl:flex shrink-0">
          {NAV.map((item) => {
            const active = isMounted && pathname === item.href
            
            if (item.comingSoon) {
              return (
                <button
                  key={item.href}
                  onClick={() => alert(`"${item.label}" 메뉴는 현재 서면 진행 중이거나 오픈 준비 중입니다!`)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-[11px] 2xl:text-xs font-semibold uppercase tracking-wide text-muted-foreground/50 hover:bg-white/5 hover:text-muted-foreground transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>{item.label}</span>
                  <span className="rounded bg-white/10 px-1 py-0.5 text-[8px] font-extrabold text-muted-foreground">SOON</span>
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-2.5 py-2 text-[11px] 2xl:text-xs font-semibold uppercase tracking-wide transition-colors whitespace-nowrap',
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

        {/* User bar & Theme Toggle & Admin Badge */}
        <div className="flex items-center gap-3 shrink-0">
          {/* 테마 전환 토글 버튼 */}
          <button
            onClick={toggleTheme}
            title={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/80 bg-white/5 text-muted-foreground hover:text-foreground hover:border-cyan/40 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-blue-400" />}
          </button>

          {isMounted && isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-gold animate-pulse shadow-[0_0_12px_rgba(250,204,21,0.3)] transition-transform hover:scale-105 whitespace-nowrap"
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
              className="flex items-center gap-2 rounded-lg bg-[#5865F2] px-3 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(88,101,242,0.8)] whitespace-nowrap"
            >
              <LogIn className="size-4" />
              <span className="hidden sm:inline">디스코드로 로그인 하기</span>
              <span className="sm:hidden">Login</span>
            </button>
          ) : (
            <div className="w-[100px] h-9" />
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

      {/* 📱 모바일 화면 전용 드롭다운 메뉴 */}
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

              if (item.comingSoon) {
                return (
                  <button
                    key={item.href}
                    onClick={() => alert(`"${item.label}" 메뉴는 현재 서면 진행 중이거나 오픈 준비 중입니다!`)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground/50 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </div>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-extrabold text-muted-foreground">SOON</span>
                  </button>
                )
              }

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