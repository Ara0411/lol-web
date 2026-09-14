'use client'

import { useState, useEffect } from 'react'
import { Coins, IdCard, Sparkles, Check, Lock } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { PlayerCard } from '@/components/player-card'
import { PageTitle } from '@/components/page-title'
import { SHOP_ITEMS, POSITION_META, type Position, type PlayerCard as PlayerCardType } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const FILTERS: (Position | 'ALL')[] = ['ALL', 'TOP', 'JG', 'MID', 'ADC', 'SUP']

export default function ShopPage() {
  const [filter, setFilter] = useState<Position | 'ALL'>('ALL')
  const [balance, setBalance] = useState(6800)
  const [owned, setOwned] = useState<string[]>([])
  
  const [players, setPlayers] = useState<PlayerCardType[]>([])
  const [loading, setLoading] = useState(true)

  // 🚀 Supabase의 players 테이블과 user_stats 테이블 연동
  useEffect(() => {
    const fetchPlayers = async () => {
      const [playersRes, statsRes] = await Promise.all([
        supabase.from('players').select('*'),
        supabase.from('user_stats').select('*'),
      ])

      if (playersRes.error) {
        console.error('players 테이블 조회 실패:', playersRes.error.message)
      }

      // user_stats 데이터를 디스코드 ID(user_identifier) 기준 Map으로 변환
      const statsMap = new Map()
      if (statsRes.data) {
        statsRes.data.forEach((stat: any) => {
          statsMap.set(stat.user_identifier, stat)
        })
      }

      if (playersRes.data) {
        const formatted: PlayerCardType[] = playersRes.data.map((item: any) => {
          const userStat = statsMap.get(item.id) || { wins: item.wins || 0, losses: item.losses || 0 }
          const wins = userStat.wins ?? 0
          const losses = userStat.losses ?? 0
          const totalGames = wins + losses
          const calculatedWinRate =
            totalGames > 0 ? Math.round((wins / totalGames) * 100) : (item.win_rate || 50)

          // 💡 반올림하지 않고 사용자가 기입한 소수점 점수(85.5 등) 그대로 유지
          const rawScore = item.destruction_score ?? item.overall ?? 85
          const scoreValue = Number(rawScore)

          return {
            id: item.id,
            summoner: item.summoner_name || '무명의소환사',
            avatar_url: item.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png',
            ko: item.position_ko || '플레이어',
            position: (item.position || 'MID') as Position,
            tier: item.tier || 'Emerald',
            lp: item.lp || 0,
            overall: scoreValue,
            destruction_score: scoreValue, // 👈 소수점 점수 원본 전달
            rarity: (item.rarity || 'rare') as 'common' | 'rare' | 'epic' | 'legendary',
            team: item.team || 'FA',
            title: item.title || '새싹 소환사',
            salaryCap: item.salary || 1000,
            stats: {
              kda: item.kda || 3.0,
              winRate: calculatedWinRate,
              csm: item.csm || 6.5,
              dpm: item.dpm || 600,
              kp: item.kp || 60,
            },
            totalGames: totalGames,
            wins: wins,
            losses: losses,
            favorite_champions: item.favorite_champions || [], // 👈 마이페이지 설정 챔피언 전달
          }
        })
        setPlayers(formatted)
      }
      setLoading(false)
    }

    fetchPlayers()
  }, [])

  const cards =
    filter === 'ALL' ? players : players.filter((c) => c.position === filter)

  function buy(id: string, price: number) {
    if (owned.includes(id) || balance < price) return
    setOwned((o) => [...o, id])
    setBalance((b) => b - price)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-cyan-400">
        <h2 className="text-lg font-bold animate-pulse">선수 카드 데이터 동기화 중...</h2>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageTitle
          overline="ROSTER & COLLECTION"
          title="선수 카드 및 상점"
          subtitle="FIFA 스타일 선수 카드를 수집하고, 팀/인게임 포인트로 프레임과 배경을 커스터마이징하세요."
        />
      </div>

      {/* Position filter */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f
          const color = f === 'ALL' ? '#22d3ee' : POSITION_META[f].color
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-lg border px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition-all',
                active ? 'text-background' : 'text-muted-foreground hover:text-foreground',
              )}
              style={
                active
                  ? { background: color, borderColor: color }
                  : { borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }
              }
            >
              {f === 'ALL' ? '전체 포지션' : `${f} · ${POSITION_META[f].ko}`}
            </button>
          )
        })}
      </div>

      {/* Cards grid */}
      {cards.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card p-12 text-center">
          <p className="text-muted-foreground">Supabase players 테이블에 등록된 선수가 없습니다. 디스코드 로그인을 완료해 보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((c) => (
            <PlayerCard key={c.id} player={c} />
          ))}
        </div>
      )}
    </div>
  )
}