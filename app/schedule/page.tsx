'use client'

import { useState, useEffect } from 'react'
import { CalendarDays, Trophy, Radio, Clock, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonBadge } from '@/components/ui/neon-badge'
import { TeamLogo } from '@/components/team-logo'
import { PageTitle } from '@/components/page-title'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface DBMatch {
  id: number
  round_name: string
  team1: string
  team2: string
  score1: number | null
  score2: number | null
  status: 'UPCOMING' | 'LIVE' | 'FINISHED'
  match_time: string
}

function BracketMatch({ teamA, teamB, scoreA, scoreB }: { teamA: string; teamB: string; scoreA: number | null; scoreB: number | null }) {
  const aWin = scoreA !== null && scoreB !== null && scoreA > scoreB
  const bWin = scoreA !== null && scoreB !== null && scoreB > scoreA
  const tbd = scoreA === null || scoreB === null

  const teams = [
    { name: teamA, score: scoreA },
    { name: teamB, score: scoreB },
  ]

  return (
    <div className="w-56 overflow-hidden rounded-lg border border-border/70 bg-white/[0.02]">
      {teams.map((t, idx) => {
        const win = idx === 0 ? aWin : bWin
        return (
          <div
            key={idx}
            className={cn(
              'flex items-center gap-2 px-3 py-2',
              idx === 0 && 'border-b border-border/60',
              win && 'bg-cyan/10',
            )}
          >
            <TeamLogo name={t.name} size={24} />
            <span
              className={cn(
                'flex-1 truncate text-xs font-semibold',
                win ? 'text-cyan' : 'text-muted-foreground',
              )}
            >
              {t.name || 'TBD'}
            </span>
            <span
              className={cn(
                'font-display text-sm font-bold tabular-nums',
                win ? 'text-cyan' : 'text-muted-foreground',
              )}
            >
              {tbd ? '-' : t.score}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function BracketColumn({
  title,
  matches,
  highlight,
}: {
  title: string
  matches: DBMatch[]
  highlight?: boolean
}) {
  return (
    <div className="flex min-w-56 flex-col justify-around gap-6">
      <p
        className={cn(
          'text-center font-display text-xs font-bold uppercase tracking-[0.2em]',
          highlight ? 'text-gold' : 'text-muted-foreground',
        )}
      >
        {title}
      </p>
      <div className="flex flex-1 flex-col justify-around gap-6">
        {matches.map((m) => (
          <BracketMatch
            key={m.id}
            teamA={m.team1}
            teamB={m.team2}
            scoreA={m.score1}
            scoreB={m.score2}
          />
        ))}
      </div>
    </div>
  )
}

export default function SchedulePage() {
  const [matches, setMatches] = useState<DBMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase.from('matches').select('*').order('id', { ascending: true })

      if (error) {
        console.error('경기 일정을 불러오지 못했습니다:', error.message)
      } else {
        setMatches(data || [])
      }
      setLoading(false)
    }

    fetchMatches()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-cyan-400">
        <h2 className="text-lg font-bold animate-pulse">대진표 데이터 동기화 중...</h2>
      </div>
    )
  }

  // 라운드별로 데이터 분류
  const quarterfinals = matches.filter((m) => m.round_name.includes('8강'))
  const semifinals = matches.filter((m) => m.round_name.includes('4강'))
  const finals = matches.filter((m) => m.round_name.includes('결승'))

  return (
    <div className="space-y-10">
      <PageTitle
        overline="Season 5 · Playoffs"
        title="Schedule & Brackets"
        subtitle="플레이오프 대진표와 주간 경기 일정을 확인하세요. 8강부터 결승까지 실시간 연동됩니다."
      />

      {/* Tournament Bracket */}
      <GlassCard className="p-5">
        <div className="mb-5 flex items-center gap-2">
          <Trophy className="size-4 text-gold" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">
            Tournament Bracket
          </h2>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max items-stretch gap-10">
            <BracketColumn title="Quarterfinals" matches={quarterfinals} />
            <BracketColumn title="Semifinals" matches={semifinals} />
            <div className="flex min-w-56 flex-col justify-center gap-6">
              <p className="text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Grand Final
              </p>
              <div className="relative rounded-xl border border-gold/40 bg-gold/5 p-3 gold-glow">
                <div className="mb-2 flex items-center justify-center gap-1.5">
                  <Trophy className="size-4 text-gold" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gold">
                    Championship
                  </span>
                </div>
                {finals.length > 0 ? (
                  <BracketMatch
                    teamA={finals[0].team1}
                    teamB={finals[0].team2}
                    scoreA={finals[0].score1}
                    scoreB={finals[0].score2}
                  />
                ) : (
                  <div className="text-center text-xs text-muted-foreground py-4">결승전 대기 중</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Weekly schedule */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="size-4 text-cyan" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">
            Weekly Match Schedule
          </h2>
        </div>
        <GlassCard className="overflow-hidden">
          <div className="hidden grid-cols-[120px_1fr_auto] gap-4 border-b border-border/60 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground sm:grid">
            <span>Day / Time</span>
            <span>Match</span>
            <span>Round</span>
          </div>
          <div className="divide-y divide-border/50">
            {matches.map((m) => {
              const isLive = m.status === 'LIVE'
              const isDone = m.status === 'FINISHED'

              return (
                <div
                  key={m.id}
                  className="grid grid-cols-1 items-center gap-3 px-5 py-4 transition-colors hover:bg-white/[0.03] sm:grid-cols-[120px_1fr_auto]"
                >
                  <div className="flex items-center gap-3 sm:block">
                    <span className="font-display text-sm font-bold text-cyan">{m.match_time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-1 items-center justify-end gap-2 text-right">
                      <span className="truncate text-sm font-semibold">{m.team1}</span>
                      <TeamLogo name={m.team1} size={30} />
                    </div>
                    <div className="flex w-16 shrink-0 items-center justify-center">
                      {isLive || isDone || (m.score1 !== null && m.score2 !== null) ? (
                        <span className="font-display text-base font-bold">
                          <span className="text-cyan">{m.score1 ?? 0}</span>
                          <span className="mx-1 text-muted-foreground">:</span>
                          <span>{m.score2 ?? 0}</span>
                        </span>
                      ) : (
                        <span className="font-display text-xs font-bold text-muted-foreground">
                          VS
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <TeamLogo name={m.team2} size={30} />
                      <span className="truncate text-sm font-semibold">{m.team2}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <span className="text-[11px] text-muted-foreground">{m.round_name}</span>
                    {isLive ? (
                      <NeonBadge tone="danger" className="animate-live">
                        <Radio className="size-3" /> Live
                      </NeonBadge>
                    ) : isDone ? (
                      <NeonBadge tone="muted">Final</NeonBadge>
                    ) : (
                      <NeonBadge tone="cyan">Upcoming</NeonBadge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}