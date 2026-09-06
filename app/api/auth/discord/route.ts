// app/api/auth/discord/callback/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  try {
    // 1. 디스코드 토큰 교환
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenData.access_token) throw new Error('토큰 발급 실패')

    // 2. 디스코드 유저 정보 가져오기
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const discordUser = await userResponse.json()

    const discordId = discordUser.id
    const username = discordUser.global_name || discordUser.username
    const avatarUrl = discordUser.avatar 
      ? `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.png`
      : '/placeholder-user.jpg'

    // 3. Supabase 선수 테이블에 자동 등록 (없으면 생성, 있으면 유지/업데이트)
    // 예: players 테이블 구조 (discord_id, summoner, avatar_url 등)
    await supabase.from('players').upsert({
      discord_id: discordId,
      summoner: username,
      avatar_url: avatarUrl,
    }, { onConflict: 'discord_id' })

    // 로그인 성공 후 메인 페이지 등으로 리다이렉트
    return NextResponse.redirect(new URL('/profile', request.url))
  } catch (error) {
    console.error('로그인 연동 에러:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }
}