import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  // 서버 사이드 환경변수 우선 적용 (클라이언트 공개용 변수도 Fallback으로 지원)
  const clientId = process.env.DISCORD_CLIENT_ID || process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  const redirectUri = process.env.DISCORD_REDIRECT_URI || process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

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
    
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('디스코드 토큰 발급 응답 에러:', tokenData)
      throw new Error('토큰 발급 실패')
    }

    // 2. 토큰을 이용해 디스코드 유저의 진짜 프로필 정보 가져오기
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const discordUser = await userResponse.json()
    
    if (!userResponse.ok || !discordUser.id) {
      console.error('디스코드 유저 정보 조회 에러:', discordUser)
      throw new Error('유저 정보 조회 실패')
    }

    // 아바타 이미지 주소 조합하기
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png'

    // 3. Supabase DB의 users 테이블에 유저 정보 저장
    const { error: dbError } = await supabase.from('users').upsert({
      id: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      avatar_url: avatarUrl,
      tier: '언랭크',
    }, { onConflict: 'id' })

    if (dbError) {
      console.error('Supabase 저장 에러:', dbError)
      throw new Error('DB 저장 실패')
    }

    // 4. 로그인 성공 후 쿠키 설정 및 메인으로 이동
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('discord_user', JSON.stringify({
      id: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      avatar: avatarUrl,
    }), { httpOnly: false, path: '/' })

    return response
  } catch (err) {
    console.error('디스코드 로그인 에러 상세:', err)
    return NextResponse.redirect(new URL('/?error=login_failed', request.url))
  }
}