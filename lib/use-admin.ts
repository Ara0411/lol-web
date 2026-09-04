'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      // 1. 디스코드 로그인 쿠키에서 유저 ID 빼오기
      let userId = null
      const cookies = document.cookie.split(';')
      const userCookie = cookies.find((c) => c.trim().startsWith('discord_user='))
      
      if (userCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
          userId = userData.id
        } catch (e) {
          console.error('쿠키 파싱 에러', e)
        }
      }

      // 2. 유저 ID가 있으면 기존 users 테이블에서 관리자 권한 확인
      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', userId)
          .single()

        if (data && !error) {
          setIsAdmin(!!data.is_admin)
        }
      }
      
      setLoading(false)
    }

    checkAdmin()
  }, [])

  return { isAdmin, loading }
}