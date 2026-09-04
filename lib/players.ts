import { supabase } from './supabase'

export interface Player {
  id: string
  summoner_name: string
  position: 'TOP' | 'JG' | 'MID' | 'AD' | 'SUP'
  tier: string
  salary: number
  wins: number
  losses: number
  avatar_url?: string
}

// Supabase에서 모든 선수 목록 가져오기
export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase.from('players').select('*')
  if (error) {
    console.error('선수 목록을 불러오지 못했습니다:', error.message)
    return []
  }
  return data || []
}