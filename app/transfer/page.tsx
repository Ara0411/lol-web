'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeftRight,
  UserPlus,
  UserMinus,
  Coins,
  Users,
  TrendingUp,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonBadge } from '@/components/ui/neon-badge'
import { TeamLogo } from '@/components/team-logo'
import { PageTitle } from '@/components/page-title'
import { POSITION_META, TIER_COLOR } from '@/lib/data'
import { supabase } from '@/lib/supabase'

const TRADE_META: Record<
  string,
  { tone: 'cyan' | 'success' | 'danger'; label: string; Icon: typeof ArrowLeftRight }
> = {
  trade: { tone: 'cyan', label: '트레이드', Icon: ArrowLeftRight },
  signing: { tone: 'success', label: '영입', Icon: UserPlus },
  release: { tone: 'danger', label: '방출', Icon: UserMinus },
}

const CAP = 5100

interface TeamData {
  id: string
  name: string
  short: string
  points: number
  color: string
}

interface FAData {
  id: string
  summoner: string
  position: string
  tier: string
  lastTeam: string
  askingPoints: number
  overall: number
  note: string
}

interface TradeData {
  id: number
  type: string
  player: string
  from: string
  to: string
  points: number
  time: string
}

export default function TransferPage() {
  const [teams, setTeams] = useState<TeamData[]>([])
  const [freeAgents, setFreeAgents] = useState<FAData[]>([])
  const [tradeFeed, setTradeFeed] = useState<TradeData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // 1. 팀 포인트 정보 가져오기
      const { data: teamData } = await supabase.from('teams').select('*')
      if (teamData) setTeams(teamData)

      // 2. FA 선수 목록 가져오기 (players 테이블에서 팀이 'FA'인 선수들)
      const { data: faData } = await supabase.from('players').select('*').eq('team', 'FA')
      if (faData) {
        const formattedFA: FAData[] = faData.map((item: any) => ({
          id: item.id,
          summoner: item.summoner_name || '무명의소환사',
          position: item.position || 'MID',
          tier: item.tier || 'Emerald',
          lastTeam: item.last_team || 'FA',
          askingPoints: item.salary || 1000,
          overall: item.overall || 85,
          note: item.title || '신규 FA',
        }))
        setFreeAgents(formattedFA)
      }

      // 3. 트레이드 피드 가져오기
      const { data: feedData } = await supabase.from('trades').select('*').order('id', { ascending: false })
      if (feedData) {
        const formattedTrades: TradeData[] = feedData.map((item: any) => ({
          id: item.id,
          type: item.type,
          player: item.player,
          from: item.from_team,
          to: item.to_team,
          points: item.points,
          time: item.time,
        }))
        setTradeFeed(formattedTrades)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-cyan-400">
        <h2 className="text-lg font-bold animate-pulse">이적시장 데이터를 불러오는 중...</h2>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <PageTitle
        overline="ROSTER MANAGEMENT"
        title="이적 시장 및 FA"
        subtitle="자유계약(FA) 선수를 영입하고, 공식 팀의 트레이드 현황과 포인트 밸런스를 추적하세요."
      />

      {/* Team point balances */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Coins className="size-4 text-gold" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">
            팀 포인트 현황 (Team Points)
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {teams.map((team) => {
            const pct = Math.round((team.points / CAP) * 100)
            return (
              <GlassCard key={team.id} hover className="p-4">
                <div className="flex items-center gap-3">
                  <TeamLogo name={team.name} size={40} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{team.name}</p>
                    <p className="text-[11px] text-muted-foreground">{team.short}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="font-display text-xl font-black text-gold tabular-nums">
                    {team.points.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-muted-foreground">P</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: team.color }}
                  />
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Free agents */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Users className="size-4 text-cyan" />
            <h2 className="font-display text-sm font-bold uppercase tracking-wide">
              자유 계약 선수 (Free Agents)
            </h2>
            <NeonBadge tone="success">{freeAgents.length}명 대기 중</NeonBadge>
          </div>
          <div className="space-y-3">
            {freeAgents.length === 0 ? (
              <div className="rounded-2xl border border-border/70 bg-card p-8 text-center text-muted-foreground">
                현재 등록된 FA 선수가 없습니다.
              </div>
            ) : (
              freeAgents.map((fa) => {
                const roleKey = (fa.position || 'MID').toUpperCase()
                const pos = (POSITION_META as any)[roleKey] || POSITION_META['MID']
                
                const tierKey = (fa.tier || 'Master') as keyof typeof TIER_COLOR
                const tierColor = (TIER_COLOR as any)[tierKey] || '#ffffff'

                return (
                  <GlassCard
                    key={fa.id}
                    hover
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <span
                        className="grid size-11 shrink-0 place-items-center rounded-lg font-display text-xs font-black"
                        style={{
                          color: pos.color,
                          background: `${pos.color}18`,
                          border: `1px solid ${pos.ring}`,
                        }}
                      >
                        {pos.label}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-bold">{fa.summoner}</p>
                        <p className="text-[11px] text-muted-foreground">
                          <span style={{ color: tierColor }}>{fa.tier}</span> · 이전 팀:{' '}
                          {fa.lastTeam} · {fa.note}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          OVR
                        </p>
                        <p className="font-display text-base font-black text-cyan">{fa.overall}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          요청 몸값
                        </p>
                        <p className="flex items-center gap-1 font-display text-sm font-bold text-gold">
                          <Coins className="size-3.5" /> {fa.askingPoints} P
                        </p>
                      </div>
                      <button className="rounded-lg bg-cyan px-3 py-2 text-xs font-bold uppercase tracking-wide text-background transition-transform hover:-translate-y-0.5 neon-cyan-glow">
                        영입 신청
                      </button>
                    </div>
                  </GlassCard>
                )
              })
            )}
          </div>
        </div>

        {/* Trade feed */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-4 text-purple" />
            <h2 className="font-display text-sm font-bold uppercase tracking-wide">실시간 이적 피드 (Trade Feed)</h2>
          </div>
          <GlassCard className="p-2">
            <div className="relative space-y-1 pl-4">
              <span className="absolute bottom-3 left-[7px] top-3 w-px bg-border" />
              {tradeFeed.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">트레이드 기록이 없습니다.</div>
              ) : (
                tradeFeed.map((t) => {
                  const meta = TRADE_META[t.type] || TRADE_META['signing']
                  const Icon = meta.Icon
                  return (
                    <div key={t.id} className="relative rounded-lg p-3 hover:bg-white/[0.03]">
                      <span
                        className="absolute -left-[13px] top-4 grid size-3.5 place-items-center rounded-full ring-4 ring-card"
                        style={{
                          background:
                            meta.tone === 'cyan'
                              ? '#22d3ee'
                              : meta.tone === 'success'
                                ? '#34d399'
                                : '#f43f5e',
                        }}
                      />
                      <div className="mb-1 flex items-center justify-between">
                        <NeonBadge tone={meta.tone}>
                          <Icon className="size-3" /> {meta.label}
                        </NeonBadge>
                        <span className="text-[10px] text-muted-foreground">{t.time}</span>
                      </div>
                      <p className="text-sm font-semibold">{t.player}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {t.from} <span className="text-cyan">→</span> {t.to}
                      </p>
                      {t.points > 0 ? (
                        <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-gold">
                          <Coins className="size-3" /> {t.points.toLocaleString()} P
                        </p>
                      ) : null}
                    </div>
                  )
                })
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}