'use client'

import { useState, useEffect } from 'react'
import { Coins, IdCard, Sparkles, Check, Lock } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonBadge } from '@/components/ui/neon-badge'
import { PlayerCard } from '@/components/player-card'
import { PageTitle } from '@/components/page-title'
import { SHOP_ITEMS, POSITION_META, type Position, type PlayerCard as PlayerCardType } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const FILTERS: (Position | 'ALL')[] = ['ALL', 'TOP', 'JG', 'MID', 'ADC', 'SUP']

const RARITY_TONE = {
  common: 'muted',
  rare: 'cyan',
  epic: 'purple',
  legendary: 'gold',
} as const

export default function ShopPage() {
  const [filter, setFilter] = useState<Position | 'ALL'>('ALL')
  const [balance, setBalance] = useState(6800)
  const [owned, setOwned] = useState<string[]>([])
  
  const [players, setPlayers] = useState<PlayerCardType[]>([])
  const [loading, setLoading] = useState(true)

  // 🚀 Supabase의 players 테이블에서 데이터 긁어오기
  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from('players').select('*')

      if (error) {
        console.error('players 테이블 조회 실패:', error.message)
      } else if (data) {
        const formatted: PlayerCardType[] = data.map((item: any) => ({
          id: item.id,
          summoner: item.summoner_name || '무명의소환사',
          ko: item.position_ko || '플레이어',
          position: (item.position || 'MID') as Position,
          tier: item.tier || 'Emerald',
          lp: item.lp || 0,
          overall: item.overall || 85,
          rarity: (item.rarity || 'rare') as 'common' | 'rare' | 'epic' | 'legendary',
          team: item.team || 'FA',
          title: item.title || '새싹 소환사',
          salaryCap: item.salary || 1000,
          stats: {
            kda: item.kda || 3.0,
            winRate: item.win_rate || 50,
            csm: item.csm || 6.5,
            dpm: item.dpm || 600,
            kp: item.kp || 60,
          },
        }))
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
        <GlassCard className="flex items-center gap-3 self-start px-4 py-3 sm:self-auto">
          <span className="grid size-9 place-items-center rounded-lg bg-gold/15">
            <Coins className="size-4 text-gold" />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              보유 포인트 (Balance)
            </p>
            <p className="font-display text-lg font-black text-gold tabular-nums">
              {balance.toLocaleString()} P
            </p>
          </div>
        </GlassCard>
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
          <p className="text-muted-foreground">Supabase `players` 테이블에 등록된 선수가 없습니다. 데이터를 채워보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((c) => (
            <PlayerCard key={c.id} player={c} />
          ))}
        </div>
      )}

      {/* Customization Shop */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-4 text-purple" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">
            카드 커스텀 상점 (Customization Shop)
          </h2>
          <span className="text-xs text-muted-foreground">프레임 · 보더 · 애니메이션 배경</span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SHOP_ITEMS.map((item) => {
            const isOwned = owned.includes(item.id)
            const affordable = balance >= item.price
            return (
              <GlassCard key={item.id} hover className="overflow-hidden">
                <div
                  className="relative flex h-32 items-center justify-center"
                  style={{ background: item.preview }}
                >
                  <div className="absolute inset-0 grid-bg opacity-30" />
                  <div className="relative flex size-16 items-center justify-center rounded-xl border border-white/20 bg-black/30 backdrop-blur">
                    <IdCard className="size-7 text-white/80" />
                  </div>
                  <div className="absolute left-3 top-3">
                    <NeonBadge tone={RARITY_TONE[item.rarity]}>{item.rarity}</NeonBadge>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-display text-sm font-bold">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.ko} · {item.type}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-display text-sm font-bold text-gold">
                      <Coins className="size-3.5" /> {item.price.toLocaleString()} P
                    </span>
                    <button
                      onClick={() => buy(item.id, item.price)}
                      disabled={isOwned || !affordable}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all',
                        isOwned
                          ? 'cursor-default border border-success/40 bg-success/10 text-success'
                          : affordable
                            ? 'bg-purple text-white hover:-translate-y-0.5 neon-purple-glow'
                            : 'cursor-not-allowed border border-border bg-white/5 text-muted-foreground',
                      )}
                    >
                      {isOwned ? (
                        <>
                          <Check className="size-3.5" /> 보유 중
                        </>
                      ) : affordable ? (
                        '구매하기'
                      ) : (
                        <>
                          <Lock className="size-3.5" /> 포인트 부족
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}