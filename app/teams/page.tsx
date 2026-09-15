'use client'

import React, { useState, useEffect } from 'react'
import { Users, Shield, Trophy, Flame } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PageTitle } from '@/components/page-title'
import { GlassCard } from '@/components/ui/glass-card'

interface TeamMember {
  name: string
  position: 'TOP' | 'JG' | 'MID' | 'ADC' | 'SUP'
  isSubstitute?: boolean
  avatarUrl: string
  tier: string
  destruction_score?: number
}

interface TeamData {
  id: string
  name: string
  logoUrl: string
  total_score: number
  color?: string
  members: TeamMember[]
}

const POSITION_ORDER = ['TOP', 'JG', 'MID', 'ADC', 'SUP']

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamsAndPlayers = async () => {
      setLoading(true)

      const [teamsRes, playersRes] = await Promise.all([
        supabase.from('teams').select('*').order('name', { ascending: true }),
        supabase.from('players').select('*'),
      ])

      if (teamsRes.error || playersRes.error) {
        console.error('팀 또는 선수 데이터를 불러오지 못했습니다.', teamsRes.error, playersRes.error)
      } else if (teamsRes.data) {
        const formattedTeams: TeamData[] = teamsRes.data.map((team: any) => {
          const teamPlayers = (playersRes.data || []).filter(
            (p: any) => p.team === team.name || p.team === team.id || p.team_id === team.id
          )

          return {
            id: team.id,
            name: team.name,
            logoUrl: team.logo_url || '/placeholder-logo.png',
            total_score: Number(team.total_score ?? 0),
            color: team.color || '#22d3ee',
            members: teamPlayers.map((p: any) => ({
              name: p.summoner_name || '소환사',
              position: p.position || 'MID',
              isSubstitute: Boolean(p.is_substitute),
              avatarUrl: p.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png',
              tier: p.tier || 'Emerald',
              destruction_score: Number(p.destruction_score ?? p.overall ?? 0),
            })),
          }
        })

        setTeams(formattedTeams)
      }
      setLoading(false)
    }

    fetchTeamsAndPlayers()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-cyan-400">
        <Shield className="size-8 animate-pulse text-cyan-400" />
        <h2 className="text-sm font-bold tracking-wider">참가 팀 로스터 동기화 중...</h2>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      <PageTitle
        overline="TOURNAMENT ROSTERS"
        title="참가 팀 및 공식 로스터"
        subtitle="롤이터 공식 참가 팀과 라인별 주전 및 후보(식스맨) 명단입니다."
      />

      {teams.length === 0 ? (
        <GlassCard className="p-12 text-center border border-white/10 bg-white/[0.02]">
          <Trophy className="mx-auto size-8 text-amber-400/50 mb-3" />
          <p className="text-sm font-semibold text-white">등록된 공식 참가 팀이 없습니다.</p>
          <p className="text-xs text-muted-foreground mt-1">
            관리자 대시보드(/admin)에서 팀을 먼저 생성해 주세요.
          </p>
        </GlassCard>
      ) : (
        teams.map((team) => {
          const membersList = team.members || []

          // 주전 5인 (TOP ➔ SUP)
          const mainMembers = POSITION_ORDER.map((pos) =>
            membersList.find((m) => m.position === pos && !m.isSubstitute)
          )

          // 후보 선수 (최대 2명)
          const substitutes = membersList.filter((m) => m.isSubstitute).slice(0, 2)

          return (
            <GlassCard
              key={team.id}
              className="p-6 md:p-8 space-y-6 border border-white/10 bg-black/60 backdrop-blur-xl rounded-2xl"
            >
              {/* 팀 헤더 영역 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-4">
                  <div
                    className="h-14 w-14 rounded-xl border border-white/20 flex items-center justify-center font-bold text-lg text-white"
                    style={{ backgroundColor: (team.color || '#22d3ee') + '22' }}
                  >
                    {team.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                      {team.name}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">롤이터 공식 참가 팀</p>
                  </div>
                </div>

                {/* 총 멸망전 점수 뱃지 */}
                <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl w-full sm:w-auto text-left sm:text-right">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1 sm:justify-end">
                    <Flame className="size-3" /> 총 멸망전 점수
                  </div>
                  <div className="text-lg font-black text-amber-300">
                    {team.total_score} <span className="text-xs text-amber-400 font-normal">점</span>
                  </div>
                </div>
              </div>

              {/* 주전 라인업 */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="size-3.5 text-cyan-400" /> 주전 라인업 (Starting Lineup)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {POSITION_ORDER.map((pos, idx) => {
                    const member = mainMembers[idx]
                    return (
                      <div
                        key={pos}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 text-center flex flex-col items-center"
                      >
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded mb-2 border border-cyan-800/40">
                          {pos}
                        </span>
                        {member ? (
                          <>
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="h-11 w-11 rounded-full mb-2 object-cover border border-white/15"
                            />
                            <div className="font-bold text-white text-xs truncate w-full">
                              {member.name}
                            </div>
                            <div className="text-[10px] text-amber-400 mt-0.5 font-semibold">
                              {member.destruction_score}점 · {member.tier}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground/60 py-4 font-medium">
                            공석 (TBD)
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 후보 선수 (식스맨) */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="size-3.5 text-purple-400" /> 후보 선수 (Substitutes · 최대 2명)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {substitutes.length > 0 ? (
                    substitutes.map((sub, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3"
                      >
                        <img
                          src={sub.avatarUrl}
                          alt={sub.name}
                          className="h-10 w-10 rounded-full object-cover border border-white/15"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs truncate">{sub.name}</span>
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              후보 ({sub.position})
                            </span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {sub.destruction_score}점 · {sub.tier}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-3.5 bg-white/[0.02] rounded-xl text-xs text-muted-foreground border border-white/5">
                      등록된 후보 선수가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )
        })
      )}
    </div>
  )
}