'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldAlert,
  Swords,
  Users,
  Trash2,
  PlusCircle,
  Building2,
  Shield,
  UserMinus,
  UserPlus2,
  Edit3,
} from 'lucide-react'
import { useAdmin } from '@/lib/use-admin'
import { supabase } from '@/lib/supabase'
import { PageTitle } from '@/components/page-title'
import { GlassCard } from '@/components/ui/glass-card'

const POSITIONS = ['TOP', 'JG', 'MID', 'ADC', 'SUP']

export default function AdminDashboard() {
  const router = useRouter()
  const { isAdmin, loading: adminLoading } = useAdmin()

  const [teams, setTeams] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // 신규 팀 생성 상태
  const [newTeam, setNewTeam] = useState({
    id: '',
    name: '',
    short: '',
  })

  // 팀별 선수 추가 선택 상태 (teamId: playerId)
  const [selectedPlayerForTeam, setSelectedPlayerForTeam] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      alert('관리자 권한이 없습니다! 메인 페이지로 이동합니다.')
      router.push('/')
      return
    }

    if (isAdmin) {
      fetchAdminData()
    }
  }, [isAdmin, adminLoading, router])

  const fetchAdminData = async () => {
    setDataLoading(true)
    const [teamsRes, matchesRes, playersRes] = await Promise.all([
      supabase.from('teams').select('*').order('name', { ascending: true }),
      supabase.from('matches').select('*').order('id', { ascending: true }),
      supabase.from('players').select('*').order('summoner_name', { ascending: true }),
    ])
    if (teamsRes.data) setTeams(teamsRes.data)
    if (matchesRes.data) setMatches(matchesRes.data)
    if (playersRes.data) setPlayers(playersRes.data)
    setDataLoading(false)
  }

  // ➕ 신규 팀 생성 (초기 포인트 없음)
  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeam.id.trim() || !newTeam.name.trim() || !newTeam.short.trim()) {
      return alert('팀 ID, 이름, 약칭을 모두 입력해주세요!')
    }

    const { error } = await supabase.from('teams').insert([
      {
        id: newTeam.id.trim(),
        name: newTeam.name.trim(),
        short: newTeam.short.trim().toUpperCase(),
        color: '#22d3ee',
      },
    ])

    if (error) {
      alert('팀 생성 실패: ' + error.message)
    } else {
      alert('새로운 팀이 등록되었습니다.')
      setNewTeam({ id: '', name: '', short: '' })
      fetchAdminData()
    }
  }

  // 🗑️ 팀 삭제
  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!confirm(`정말 "${teamName}" 팀을 삭제하시겠습니까? 소속 선수는 FA로 전환됩니다.`)) return

    // 소속 선수를 먼저 FA로 해제
    await supabase.from('players').update({ team: 'FA' }).eq('team', teamName)
    const { error } = await supabase.from('teams').delete().eq('id', teamId)

    if (error) {
      alert('팀 삭제 실패: ' + error.message)
    } else {
      alert('팀이 삭제되었습니다.')
      fetchAdminData()
    }
  }

  // 🔄 팀 이름 / 약칭 수정
  const handleEditTeamInfo = async (team: any) => {
    const newName = prompt('수정할 팀 이름을 입력하세요:', team.name)
    if (newName === null || !newName.trim()) return

    const newShort = prompt('수정할 팀 약칭을 입력하세요:', team.short)
    if (newShort === null || !newShort.trim()) return

    const { error } = await supabase
      .from('teams')
      .update({ name: newName.trim(), short: newShort.trim().toUpperCase() })
      .eq('id', team.id)

    if (error) {
      alert('팀 정보 수정 실패: ' + error.message)
    } else {
      // 기존 소속 선수들의 team 명칭도 동기화
      if (team.name !== newName.trim()) {
        await supabase.from('players').update({ team: newName.trim() }).eq('team', team.name)
      }
      alert('팀 정보가 수정되었습니다.')
      fetchAdminData()
    }
  }

  // 🔄 선수 팀 배정 / 변경
  const handleChangePlayerTeam = async (playerId: string, teamName: string) => {
    const { error } = await supabase.from('players').update({ team: teamName }).eq('id', playerId)
    if (error) alert('팀 변경 실패: ' + error.message)
    else fetchAdminData()
  }

  // 🔄 선수 포지션 변경
  const handleChangePlayerPosition = async (playerId: string, position: string) => {
    const { error } = await supabase.from('players').update({ position }).eq('id', playerId)
    if (error) alert('포지션 변경 실패: ' + error.message)
    else fetchAdminData()
  }

  // 🔄 주전 / 후보 토글
  const handleToggleSubstitute = async (playerId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('players')
      .update({ is_substitute: !currentStatus })
      .eq('id', playerId)
    if (error) alert('로스터 상태 변경 실패: ' + error.message)
    else fetchAdminData()
  }

  // 🔄 선수 텍스트/숫자 필드 직접 수정 (닉네임, 티어, 멸망전 점수)
  const handleUpdatePlayerField = async (playerId: string, field: string, currentValue: any) => {
    const fieldNames: Record<string, string> = {
      summoner_name: '소환사 닉네임',
      tier: '티어',
      destruction_score: '멸망전 점수',
    }

    const input = prompt(`새로운 ${fieldNames[field] || field} 값을 입력하세요:`, String(currentValue ?? ''))
    if (input === null) return

    let updateVal: any = input.trim()
    if (field === 'destruction_score') {
      updateVal = parseFloat(input)
      if (isNaN(updateVal)) return alert('점수는 숫자(소수점 가능)로 입력해주세요.')
    }

    const { error } = await supabase.from('players').update({ [field]: updateVal }).eq('id', playerId)
    if (error) alert('수정 실패: ' + error.message)
    else fetchAdminData()
  }

  // 🗑️ 선수 카드 DB 삭제
  const handleDeletePlayer = async (playerId: string, summonerName: string) => {
    if (!confirm(`정말 "${summonerName}" 선수를 삭제하시겠습니까?`)) return
    const { error } = await supabase.from('players').delete().eq('id', playerId)
    if (error) alert('선수 삭제 실패: ' + error.message)
    else fetchAdminData()
  }

  // 💾 경기 스코어 / 대진 수정
  const handleUpdateMatch = async (matchId: number, field: string, currentValue: any) => {
    const input = prompt(`새로운 ${field} 값을 입력하세요:`, String(currentValue ?? ''))
    if (input === null) return

    let updateData = {}
    if (field === 'status') {
      const upperStatus = input.toUpperCase()
      if (!['UPCOMING', 'LIVE', 'FINISHED'].includes(upperStatus)) {
        return alert('상태는 UPCOMING, LIVE, FINISHED 중 하나여야 합니다.')
      }
      updateData = { status: upperStatus }
    } else if (field === 'team1' || field === 'team2') {
      updateData = { [field]: input.trim() }
    } else {
      const parsedNum = parseInt(input, 10)
      if (isNaN(parsedNum)) return alert('점수는 숫자만 입력해주세요.')
      updateData = { [field]: parsedNum }
    }

    const { error } = await supabase.from('matches').update(updateData).eq('id', matchId)
    if (error) alert('경기 업데이트 실패: ' + error.message)
    else fetchAdminData()
  }

  if (adminLoading || dataLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-cyan-400">
        <h2 className="flex items-center gap-2 text-lg font-bold animate-pulse">
          <ShieldAlert className="size-5" /> 관리자 데이터 불러오는 중...
        </h2>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="space-y-12 pb-24">
      <PageTitle
        overline="ADMIN MASTER"
        title="리그 관리자 대시보드"
        subtitle="팀 생성 및 소속 로스터 인원 조정, 등록된 선수 정보 수정, 경기 대진을 통제합니다."
      />

      {/* 1. 팀 생성 및 팀별 소속 인원 관리 */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-cyan-400" />
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-cyan-400">
            팀 생성 및 소속 인원 관리
          </h2>
        </div>

        {/* 팀 등록 폼 */}
        <GlassCard className="p-5 border-cyan/30 bg-cyan/5">
          <h3 className="text-sm font-bold text-cyan-300 mb-3 flex items-center gap-2">
            <PlusCircle className="size-4" /> 신규 팀 등록
          </h3>
          <form onSubmit={handleAddTeam} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">팀 ID (고유 영문)</label>
              <input
                type="text"
                placeholder="예: team_test1"
                value={newTeam.id}
                onChange={(e) => setNewTeam({ ...newTeam, id: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">팀 이름</label>
              <input
                type="text"
                placeholder="예: test1"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">팀 약칭</label>
              <input
                type="text"
                placeholder="예: TST"
                value={newTeam.short}
                onChange={(e) => setNewTeam({ ...newTeam, short: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-black hover:bg-cyan-400 transition-colors"
              >
                + 팀 생성
              </button>
            </div>
          </form>
        </GlassCard>

        {/* 생성된 팀 목록 & 소속 선수 관리 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {teams.map((team) => {
            const teamMembers = players.filter((p) => p.team === team.name || p.team === team.id)
            const faPlayers = players.filter((p) => p.team !== team.name && p.team !== team.id)

            return (
              <GlassCard key={team.id} className="p-5 border-cyan/20 bg-cyan/5 space-y-4">
                {/* 팀 상단 바 */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      {team.name}
                      <span className="text-xs font-normal text-muted-foreground">({team.short})</span>
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      소속 인원: <span className="text-cyan-400 font-bold">{teamMembers.length}명</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditTeamInfo(team)}
                      className="px-2.5 py-1 text-xs rounded bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1"
                    >
                      <Edit3 className="size-3" /> 팀 수정
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"
                      title="팀 삭제"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* 소속 선수 리스트 */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-muted-foreground">소속 로스터</span>
                  {teamMembers.length === 0 ? (
                    <div className="text-xs text-muted-foreground/60 py-3 text-center border border-dashed border-white/10 rounded-lg">
                      소속된 선수가 없습니다.
                    </div>
                  ) : (
                    teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-white/10 font-bold text-[10px] text-cyan-300">
                            {member.position}
                          </span>
                          <span className="font-bold text-white">{member.summoner_name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {member.is_substitute ? '(후보)' : '(주전)'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleChangePlayerTeam(member.id, 'FA')}
                          className="text-[11px] text-red-400 hover:underline flex items-center gap-1 font-bold"
                          title="팀에서 제외하여 FA로 보냄"
                        >
                          <UserMinus className="size-3" /> 방출 (FA)
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* 팀에 선수 즉시 추가/영입 */}
                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  <select
                    value={selectedPlayerForTeam[team.id] || ''}
                    onChange={(e) =>
                      setSelectedPlayerForTeam({ ...selectedPlayerForTeam, [team.id]: e.target.value })
                    }
                    className="flex-1 rounded border border-white/20 bg-black/50 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="">선수 선택 후 팀에 추가...</option>
                    {faPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.summoner_name} ({p.position} · 현재: {p.team || 'FA'})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const playerId = selectedPlayerForTeam[team.id]
                      if (!playerId) return alert('추가할 선수를 선택해주세요.')
                      handleChangePlayerTeam(playerId, team.name)
                      setSelectedPlayerForTeam({ ...selectedPlayerForTeam, [team.id]: '' })
                    }}
                    className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 font-bold text-black text-xs flex items-center gap-1 shrink-0"
                  >
                    <UserPlus2 className="size-3.5" /> 영입
                  </button>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </section>

      {/* 2. 대진표 및 경기 스코어 제어 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Swords className="size-5 text-cyan-400" />
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-cyan-400">
            경기 스코어 및 팀 제어
          </h2>
        </div>
        <div className="space-y-3">
          {matches.map((match) => (
            <GlassCard key={match.id} className="p-4 border-cyan/20 bg-cyan/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase">{match.round_name}</span>
                  <div className="flex items-center gap-3 mt-1 font-display text-lg font-bold">
                    <span>{match.team1}</span>
                    <span className="text-muted-foreground">({match.score1 ?? 0})</span>
                    <span className="text-sm text-muted-foreground">VS</span>
                    <span className="text-muted-foreground">({match.score2 ?? 0})</span>
                    <span>{match.team2}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleUpdateMatch(match.id, 'team1', match.team1)}
                    className="rounded bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20"
                  >
                    팀1 변경
                  </button>
                  <button
                    onClick={() => handleUpdateMatch(match.id, 'team2', match.team2)}
                    className="rounded bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20"
                  >
                    팀2 변경
                  </button>
                  <button
                    onClick={() => handleUpdateMatch(match.id, 'score1', match.score1 ?? 0)}
                    className="rounded bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20"
                  >
                    팀1 점수
                  </button>
                  <button
                    onClick={() => handleUpdateMatch(match.id, 'score2', match.score2 ?? 0)}
                    className="rounded bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20"
                  >
                    팀2 점수
                  </button>
                  <button
                    onClick={() => handleUpdateMatch(match.id, 'status', match.status)}
                    className="rounded border border-cyan/50 bg-cyan/10 px-3 py-1 text-xs font-bold text-cyan-400 hover:bg-cyan hover:text-black"
                  >
                    상태 ({match.status})
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 3. 등록된 선수 카드 목록 및 상세 수정 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-purple-400" />
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-purple-400">
            등록된 선수 카드 관리 및 수정
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <GlassCard key={player.id} className="p-4 border-purple/25 bg-purple/5 space-y-3.5">
              {/* 선수 헤더 및 정보 직접 수정 버튼 */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base text-white">{player.summoner_name}</p>
                    <button
                      onClick={() => handleUpdatePlayerField(player.id, 'summoner_name', player.summoner_name)}
                      className="text-muted-foreground hover:text-white"
                      title="닉네임 수정"
                    >
                      <Edit3 className="size-3" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    티어: <strong className="text-gray-300">{player.tier}</strong> · 멸망전 점수:{' '}
                    <strong className="text-amber-400">{player.destruction_score ?? 0}</strong>
                  </p>
                </div>
                <button
                  onClick={() => handleDeletePlayer(player.id, player.summoner_name)}
                  className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                  title="선수 카드 삭제"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* 포지션 & 소속 팀 실시간 컨트롤러 */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1">소속 팀</label>
                    <select
                      value={player.team || 'FA'}
                      onChange={(e) => handleChangePlayerTeam(player.id, e.target.value)}
                      className="w-full rounded border border-white/20 bg-black/40 px-2 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none"
                    >
                      <option value="FA">FA (무소속)</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1">포지션</label>
                    <select
                      value={player.position || 'MID'}
                      onChange={(e) => handleChangePlayerPosition(player.id, e.target.value)}
                      className="w-full rounded border border-white/20 bg-black/40 px-2 py-1.5 text-xs text-foreground font-semibold focus:outline-none"
                    >
                      {POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 주전 / 후보 토글 */}
                <div>
                  <button
                    onClick={() => handleToggleSubstitute(player.id, Boolean(player.is_substitute))}
                    className={`w-full py-1.5 px-2 rounded text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      player.is_substitute
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
                        : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25'
                    }`}
                  >
                    {player.is_substitute ? (
                      <>
                        <Users className="size-3.5" /> 식스맨 / 후보
                      </>
                    ) : (
                      <>
                        <Shield className="size-3.5" /> 선발 / 주전
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 스탯(티어/멸망전 점수) 빠른 수정 */}
              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-white/10 text-xs">
                <button
                  onClick={() => handleUpdatePlayerField(player.id, 'tier', player.tier)}
                  className="rounded bg-white/10 px-2 py-1 font-bold hover:bg-white/20 text-[11px]"
                >
                  티어 변경
                </button>
                <button
                  onClick={() =>
                    handleUpdatePlayerField(player.id, 'destruction_score', player.destruction_score)
                  }
                  className="rounded bg-amber-500/20 px-2 py-1 font-bold text-amber-300 hover:bg-amber-500/30 text-[11px]"
                >
                  점수 변경
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  )
}