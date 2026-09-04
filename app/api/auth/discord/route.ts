import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

  try {
    // 1. 디스코드 서버에 코드를 주고 액세스 토큰(Access Token) 교환
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
    if (!tokenData.access_token) {
      throw new Error('토큰 발급 실패')
    }

    // 2. 토큰을 이용해 디스코드 유저의 진짜 프로필 정보(ID, 이름, 아바타 등) 가져오기
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const discordUser = await userResponse.json()

    // 아바타 이미지 주소 조합하기 (아바타가 없으면 기본 이미지 제공)
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png'

    // 3. Supabase DB의 users 테이블에 진짜 유저 정보 저장 (이미 있으면 닉네임/사진 업데이트)
    await supabase.from('users').upsert([
      {
        id: discordUser.id,
        username: discordUser.global_name || discordUser.username,
        avatar_url: avatarUrl,
        tier: '언랭크', // 기본값
      },
    ])

    // 4. 로그인 성공 후 유저 정보를 브라우저 쿠키나 로컬스토리지에 전달하기 위해 메인으로 이동하면서 정보 전달
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('discord_user', JSON.stringify({
      id: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      avatar: avatarUrl,
    }), { httpOnly: false, path: '/' })

    return response
  } catch (err) {
    console.error('디스코드 로그인 에러:', err)
    return NextResponse.redirect(new URL('/?error=login_failed', request.url))
  }
}