import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  const clientId = process.env.DISCORD_CLIENT_ID || process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  const redirectUri = process.env.DISCORD_REDIRECT_URI || process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId || '',
        client_secret: clientSecret || '',
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri || '',
      }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error('토큰 발급 실패')
    }

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const discordUser = await userResponse.json()
    if (!userResponse.ok || !discordUser.id) {
      throw new Error('유저 정보 조회 실패')
    }

    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png'

    const username = discordUser.global_name || discordUser.username

    // 1. users 테이블 저장 (닉네임/아바타 최신화)
    await supabase.from('users').upsert({
      id: discordUser.id,
      username: username,
      avatar_url: avatarUrl,
      tier: '언랭크',
    }, { onConflict: 'id' })

    // 2. players 테이블 기존 등록 여부 확인
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('id')
      .eq('id', discordUser.id)
      .maybeSingle()

    if (!existingPlayer) {
      // 💡 최초 로그인 시에만 기본 카드 생성
      await supabase.from('players').insert([
        {
          id: discordUser.id,
          summoner_name: username,
          avatar_url: avatarUrl,
          tier: 'Emerald',
          position: 'MID',
          rarity: 'rare',
          overall: 85,
          destruction_score: 85, // 멸망전 점수 기본값
        }
      ])
    } else {
      // 💡 기존 카드가 이미 있다면 유저가 수정한 티어/포지션/점수는 보존하고 아바타만 최신화
      await supabase
        .from('players')
        .update({
          avatar_url: avatarUrl,
        })
        .eq('id', discordUser.id)
    }

    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('discord_user', JSON.stringify({
      id: discordUser.id,
      username: username,
      avatar: avatarUrl,
    }), { httpOnly: false, path: '/' })

    return response
  } catch (err) {
    console.error('디스코드 로그인 에러 상세:', err)
    return NextResponse.redirect(new URL('/?error=login_failed', request.url))
  }
}