'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (!code) {
      alert('인증 코드가 없습니다!')
      router.push('/')
      return
    }

    // 서버 API 라우트로 코드 전달
    window.location.href = `/api/auth/discord?code=${code}`
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#090A0F] text-white">
      <div className="text-center">
        <h2 className="text-xl font-bold text-cyan-400">디스코드 프로필 동기화 중...</h2>
        <p className="text-sm text-gray-400 mt-2">잠시만 기다려 주세요!</p>
      </div>
    </div>
  )
}