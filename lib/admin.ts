import { supabase } from '@/lib/supabase'

// 현재 로그인한 유저가 관리자(is_admin = true)인지 확인하는 함수
export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!userId) return false

  const { data, error } = await supabase
    .from('profiles') // 또는 유저 정보를 저장하는 테이블명
    .select('is_admin')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return false
  }

  return !!data.is_admin
}