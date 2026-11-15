'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  LogIn,
  LogOut,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DiscordUser {
  id: string
  username: string
  avatar: string
}

export function SiteHeader() {
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isWhiteMode, setIsWhiteMode] = useState(true)

  useEffect(() => {
    setIsMounted(true)

    // 테마 초기 설정 확인 (로컬스토리지 또는 기본 다크모드)
    const storedTheme = localStorage.getItem('theme')
    const prefersWhite = window.matchMedia('(prefers-color-scheme: White)').matches
    
    if (storedTheme === 'light' || (!storedTheme && !prefersWhite)) {
      setIsWhiteMode(false)
      document.documentElement.classList.remove('white')
    } else {
      setIsWhiteMode(true)
      document.documentElement.classList.add('White')
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
    if (isWhiteMode) {
      document.documentElement.classList.remove('white')
      localStorage.setItem('theme', 'light')
      setIsWhiteMode(false)
    } else {
      document.documentElement.classList.add('white')
      localStorage.setItem('theme', 'white')
      setIsWhiteMode(true)
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
          <span className="grid size-9 place-items-center rounded-lg border border-[#c7d2fe]/30 bg-[#c7d2fe]/10 shadow-[0_0_20px_-6px_rgba(199,210,254,0.6)]">
            <Moon className="size-5 text-[#dbe4ff]" />
          </span>
          <span className="leading-none">
            <span className="block text-lg font-black tracking-tight text-[#eef2ff] [text-shadow:0_0_16px_rgba(199,210,254,0.55)]">
              여운
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Discord Server
            </span>
          </span>
        </Link>

        {/* User bar & Theme Toggle & Admin Badge */}
        <div className="flex items-center gap-3 shrink-0">
          {/* 테마 전환 토글 버튼 */}
          <button
            onClick={toggleTheme}
            title={isWhiteMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/80 bg-white/5 text-muted-foreground hover:text-foreground hover:border-cyan/40 transition-colors"
            aria-label="Toggle theme"
          >
            {isWhiteMode ? <Moon className="size-4 text-blue-400" />  : <Sun className="size-4 text-amber-400" />}
          </button>

          {isMounted && isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-gold animate-pulse shadow-[0_0_12px_rgba(250,204,21,0.3)] transition-transform hover:scale-105 whitespace-nowrap"
            >
              <ShieldCheck className="size-4" />
              <span className="hidden sm:inline">ADMIN MASTER</span>
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

        </div>
      </div>

    </header>
  )
}