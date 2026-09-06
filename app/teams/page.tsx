'use client'

import React, { useState, useEffect } from 'react'
import { Users, Shield, Trophy } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PageTitle } from '@/components/page-title'
import { GlassCard } from '@/components/ui/glass-card'

interface TeamMember {
  name: string
  position: 'TOP' | 'JG' | 'MID' | 'ADC' | 'SUP'
  isSubstitute?: boolean
  avatarUrl: string
  tier: string
}

interface TeamData {
  id: string
  name: string
  logoUrl: string
  points: number
  members: TeamMember[]
}

const POSITION_ORDER = ['TOP', 'JG', 'MID', 'ADC', 'SUP']

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamsAndPlayers = async () => {
      // 1. 팀 목록 불러오기
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('points', { ascending: false })

      // 2. 선수 목록 불러오기
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')

      if (teamsError || playersError) {
        console.error('팀 또는 선수 데이터를 불러오지 못했습니다.')
      } else if (teamsData) {
        // 팀별로 멤버 매핑 (DB 구조에 맞게 조율 가능)
        const formattedTeams: TeamData[] = teamsData.map((team: any) => {
          const teamPlayers = (playersData || []).filter(
            (p: any) => p.team === team.name || p.team_id === team.id
          )

          return {
            id: team.id,
            name: team.name,
            logoUrl: team.logo_url || '/placeholder-logo.png',
            points: team.points || 0,
            members: teamPlayers.map((p: any) => ({
              name: p.summoner_name,
              position: p.position,
              isSubstitute: p.is_substitute || false,
              avatarUrl: p.avatar_url || '/placeholder-user.jpg',
              tier: p.tier || 'Emerald',
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
      <div className="flex min-h-[60vh] items-center justify-center text-cyan-400">
        <h2 className="text-lg font-bold animate-pulse">참가 팀 로스터 동기화 중...</h2>
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-20">
      <PageTitle
        overline="TOURNAMENT ROSTERS"
        title="참가 팀 및 로스터"
        subtitle="롤이터 리그에 참전하는 공식 프로 팀들과 주전 및 후보(식스맨) 로스터를 확인하세요."
      />

      {teams.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-muted-foreground">등록된 팀 데이터가 없습니다.</p>
        </GlassCard>
      ) : (
        teams.map((team) => {
          const membersList = team.members || []

          // 주전 멤버 필터링 및 지정된 순서대로 정렬
          const mainMembers = POSITION_ORDER.map(
            (pos) => membersList.find((m) => m.position === pos && !m.isSubstitute)
          ).filter(Boolean) as TeamMember[]

          // 하단 후보 멤버 필터링
          const substitutes = membersList.filter((m) => m.isSubstitute)

          return (
            <GlassCard key={team.id} className="p-6 md:p-8 space-y-6">
              {/* 팀 헤더 (팀명, 로고, 포인트) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={team.logoUrl}
                    alt={team.name}
                    className="h-16 w-16 rounded-xl border border-white/20 object-cover bg-white/5"
                  />
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white">{team.name}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">롤이터 공식 프로 팀</p>
                  </div>
                </div>
                <div className="text-left sm:text-right bg-gold/10 border border-gold/30 px-4 py-2 rounded-xl w-full sm:w-auto">
                  <div className="text-[10px] uppercase tracking-widest text-gold/80">보유 팀 포인트</div>
                  <div className="text-lg font-bold text-gold">{team.points.toLocaleString()} P</div>
                </div>
              </div>

              {/* 주전 로스터 (라인별 정렬: TOP -> JG -> MID -> ADC -> SUP) */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase flex items-center gap-1.5">
                  <Shield className="size-3.5 text-cyan" /> 주전 로스터 (Starting Lineup)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {POSITION_ORDER.map((pos) => {
                    const member = mainMembers.find((m) => m.position === pos)
                    return (
                      <div key={pos} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center flex flex-col items-center">
                        <span className="text-[10px] font-bold text-cyan bg-cyan/10 px-2 py-0.5 rounded mb-2 border border-cyan/20">
                          {pos}
                        </span>
                        {member ? (
                          <>
                            <img src={member.avatarUrl} alt={member.name} className="h-12 w-12 rounded-full mb-2 object-cover border border-white/10" />
                            <div className="font-bold text-white text-xs truncate w-full">{member.name}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{member.tier}</div>
                          </>
                        ) : (
                          <div className="text-xs text-gray-500 py-4">공석 (TBD)</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 후보 선수 영역 (식스맨) */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase flex items-center gap-1.5">
                  <Users className="size-3.5 text-purple-400" /> 후보 선수 및 식스맨 (Substitutes)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {substitutes.length > 0 ? (
                    substitutes.map((sub, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                        <img src={sub.avatarUrl} alt={sub.name} className="h-10 w-10 rounded-full object-cover border border-white/10" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{sub.name}</span>
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">후보 ({sub.position})</span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{sub.tier}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-4 bg-white/5 rounded-xl text-xs text-gray-500 border border-white/5">
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