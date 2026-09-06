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

    // 1. users 테이블에 저장
    await supabase.from('users').upsert({
      id: discordUser.id,
      username: username,
      avatar_url: avatarUrl,
      tier: '언랭크',
    }, { onConflict: 'id' })

    // 2. players 테이블에도 자동으로 연동되도록 저장 (상점/로스터 카드용)
    // await supabase.from('players').upsert({
    //   id: discordUser.id,
    //   summoner_name: username,
    //   avatar_url: avatarUrl,
    //   tier: 'Emerald',
    //   position: 'MID',
    //   rarity: 'rare',
    //   overall: 85,
    // }, { onConflict: 'id' })
    // 2. players 테이블에도 자동으로 연동되도록 저장 (상점/로스터 카드용)
    const { error: playerError } = await supabase.from('players').upsert({
      id: discordUser.id,
      summoner_name: username,
      avatar_url: avatarUrl,
      tier: 'Emerald',
      position: 'MID',
      rarity: 'rare',
      overall: 85,
    }, { onConflict: 'id' })

    if (playerError) {
      console.error('players 테이블 저장 실패 에러:', playerError)
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