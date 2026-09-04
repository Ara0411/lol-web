'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert, Coins, Swords, Users, Save, UserPlus, Trash2 } from 'lucide-react'
import { useAdmin } from '@/lib/use-admin'
import { supabase } from '@/lib/supabase'
import { PageTitle } from '@/components/page-title'
import { GlassCard } from '@/components/ui/glass-card'

export default function AdminDashboard() {
  const router = useRouter()
  const { isAdmin, loading: adminLoading } = useAdmin()
  
  const [teams, setTeams] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // 신규 선수 추가 폼 상태
  const [newPlayer, setNewPlayer] = useState({
    summoner_name: '',
    position: 'MID',
    tier: 'Emerald',
    overall: 85,
    rarity: 'rare',
    team: 'FA',
    salary: 1000,
    title: '새싹 소환사'
  })

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
      supabase.from('teams').select('*').order('points', { ascending: false }),
      supabase.from('matches').select('*').order('id', { ascending: true }),
      supabase.from('players').select('*').order('overall', { ascending: false })
    ])
    if (teamsRes.data) setTeams(teamsRes.data)
    if (matchesRes.data) setMatches(matchesRes.data)
    if (playersRes.data) setPlayers(playersRes.data)
    setDataLoading(false)
  }

  // 💾 팀 포인트 수정
  const handleUpdateTeamPoint = async (teamId: string, currentPoints: number) => {
    const input = prompt('수정할 팀 포인트를 입력하세요:', String(currentPoints))
    if (input === null) return
    const newPoints = parseInt(input, 10)
    
    if (!isNaN(newPoints)) {
      const { error } = await supabase.from('teams').update({ points: newPoints }).eq('id', teamId)
      if (error) alert('포인트 업데이트 실패: ' + error.message)
      else {
        alert('포인트가 성공적으로 수정되었습니다!')
        fetchAdminData()
      }
    }
  }

  // 💾 매치 정보 수정
  const handleUpdateMatch = async (matchId: number, field: string, currentValue: any) => {
    const input = prompt(`새로운 ${field} 값을 입력하세요:`, String(currentValue))
    if (input === null) return
    
    let updateData = {}
    if (field === 'status') {
      const upperStatus = input.toUpperCase()
      if (!['UPCOMING', 'LIVE', 'FINISHED'].includes(upperStatus)) {
        return alert("상태는 UPCOMING(예정), LIVE(진행 중), FINISHED(종료) 중 하나여야 합니다.")
      }
      updateData = { status: upperStatus }
    } else {
      updateData = { [field]: parseInt(input, 10) }
    }

    const { error } = await supabase.from('matches').update(updateData).eq('id', matchId)
    if (error) alert('경기 정보 업데이트 실패: ' + error.message)
    else {
      fetchAdminData()
    }
  }

  // 관리자 전용 선수 정보 수정 함수 예시
  const handleUpdatePlayer = async (playerId: string, field: string, currentValue: any) => {
    const input = prompt(`선수의 새로운 ${field} 값을 입력하세요:`, String(currentValue))
    if (input === null) return

    let updateValue: any = input
    if (['overall', 'salary'].includes(field)) {
      updateValue = parseInt(input, 10)
      if (isNaN(updateValue)) return alert('숫자만 입력 가능합니다.')
    }

    const { error } = await supabase.from('players').update({ [field]: updateValue }).eq('id', playerId)
    if (error) alert('선수 정보 업데이트 실패: ' + error.message)
    else {
      alert('선수 정보가 수정되었습니다!')
      fetchAdminData()
    }
  }

  // ➕ 신규 선수 카드 추가 핸들러
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlayer.summoner_name) {
      return alert('선수 롤 닉네임을 입력해주세요!')
    }

    const payload = {
      id: 'player_' + Math.random().toString(36).substring(2, 9),
      summoner_name: newPlayer.summoner_name,
      position: newPlayer.position,
      tier: newPlayer.tier,
      overall: Number(newPlayer.overall),
      rarity: newPlayer.rarity,
      team: newPlayer.team,
      salary: Number(newPlayer.salary),
      title: newPlayer.title,
      wins: 0,
      losses: 0,
      kda: 3.0,
      win_rate: 50
    }

    const { error } = await supabase.from('players').insert([payload])
    if (error) {
      alert('선수 등록 실패: ' + error.message)
    } else {
      alert('신규 선수 카드가 성공적으로 등록되었습니다!')
      setNewPlayer({
        summoner_name: '',
        position: 'MID',
        tier: 'Emerald',
        overall: 85,
        rarity: 'rare',
        team: 'FA',
        salary: 1000,
        title: '새싹 소환사'
      })
      fetchAdminData()
    }
  }

  // 🗑️ 선수 카드 삭제 핸들러
  const handleDeletePlayer = async (playerId: string, summonerName: string) => {
    if (!confirm(`정말 "${summonerName}" 선수의 카드를 삭제하시겠습니까?`)) return

    const { error } = await supabase.from('players').delete().eq('id', playerId)
    if (error) {
      alert('선수 삭제 실패: ' + error.message)
    } else {
      alert('선수가 삭제되었습니다.')
      fetchAdminData()
    }
  }

  if (adminLoading || dataLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gold">
        <h2 className="flex items-center gap-2 text-lg font-bold animate-pulse">
          <ShieldAlert className="size-5" /> 관리자 데이터 동기화 중...
        </h2>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="space-y-12 pb-20">
      <PageTitle
        overline="ADMIN MASTER"
        title="리그 관리자 대시보드"
        subtitle="롤이터 리그의 팀 포인트, 경기 스코어, 선수 카드 등록 및 스탯을 실시간으로 제어할 수 있는 마스터 패널입니다."
      />

      {/* 1. 팀 포인트 제어 패널 */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Coins className="size-5 text-gold" />
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-gold">
            팀 포인트 관리
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <GlassCard key={team.id} className="p-4 flex items-center justify-between border-gold/20 bg-gold/5">
              <div>
                <p className="font-bold text-lg">{team.name}</p>
                <p className="text-sm text-muted-foreground">{team.points.toLocaleString()} 포인트</p>
              </div>
              <button 
                onClick={() => handleUpdateTeamPoint(team.id, team.points)}
                className="flex items-center gap-1 rounded bg-gold/20 px-3 py-1.5 text-xs font-bold text-gold hover:bg-gold hover:text-black transition-all"
              >
                <Save className="size-3" /> 수정
              </button>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 2. 대진표 및 경기 스코어 제어 패널 */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Swords className="size-5 text-cyan-400" />
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-cyan-400">
            경기 스코어 및 상태 제어
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
                    상태 변경 ({match.status})
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 3. 선수 카드 추가 & 관리 패널 */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-purple-400" />
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-purple-400">
            선수 카드 관리 및 생성
          </h2>
        </div>

        {/* 신규 선수 등록 폼 */}
        <GlassCard className="p-6 border-purple/30 bg-purple/5">
          <h3 className="text-sm font-bold text-purple-300 mb-4 flex items-center gap-2">
            <UserPlus className="size-4" /> 신규 선수 카드 수동 등록
          </h3>
          <form onSubmit={handleAddPlayer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">롤 닉네임</label>
              <input
                type="text"
                placeholder="예: Hideonbush#KR1"
                value={newPlayer.summoner_name}
                onChange={(e) => setNewPlayer({ ...newPlayer, summoner_name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">포지션</label>
              <select
                value={newPlayer.position}
                onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-purple-400 focus:outline-none"
              >
                <option value="TOP">TOP</option>
                <option value="JG">JG</option>
                <option value="MID">MID</option>
                <option value="ADC">ADC</option>
                <option value="SUP">SUP</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">티어</label>
              <input
                type="text"
                placeholder="예: Challenger"
                value={newPlayer.tier}
                onChange={(e) => setNewPlayer({ ...newPlayer, tier: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">오버롤 (OVR)</label>
              <input
                type="number"
                value={newPlayer.overall}
                onChange={(e) => setNewPlayer({ ...newPlayer, overall: Number(e.target.value) })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">카드 등급</label>
              <select
                value={newPlayer.rarity}
                onChange={(e) => setNewPlayer({ ...newPlayer, rarity: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-purple-400 focus:outline-none"
              >
                <option value="common">일반 (Common)</option>
                <option value="rare">레어 (Rare)</option>
                <option value="epic">에픽 (Epic)</option>
                <option value="legendary">전설 (Legendary)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">소속 팀 (또는 FA)</label>
              <input
                type="text"
                value={newPlayer.team}
                onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">샐러리 캡 (몸값)</label>
              <input
                type="number"
                value={newPlayer.salary}
                onChange={(e) => setNewPlayer({ ...newPlayer, salary: Number(e.target.value) })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition-colors"
              >
                + 선수 카드 등록하기
              </button>
            </div>
          </form>
        </GlassCard>

        {/* 기존 등록된 선수 목록 및 편집/삭제 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <GlassCard key={player.id} className="p-4 border-purple/25 bg-purple/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-base">{player.summoner_name}</p>
                  <p className="text-xs text-muted-foreground">{player.position} · {player.tier} (OVR: {player.overall})</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-purple/20 px-2 py-1 text-xs font-bold text-purple-300">
                    {player.team}
                  </span>
                  <button
                    onClick={() => handleDeletePlayer(player.id, player.summoner_name)}
                    className="text-muted-foreground hover:text-red-400 transition-colors"
                    title="선수 삭제"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span>몸값: <strong className="text-gold">{player.salary}</strong></span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => handleUpdatePlayer(player.id, 'overall', player.overall)}
                    className="rounded bg-white/10 px-2.5 py-1 font-bold hover:bg-white/20"
                  >
                    OVR 수정
                  </button>
                  <button 
                    onClick={() => handleUpdatePlayer(player.id, 'salary', player.salary)}
                    className="rounded bg-gold/20 px-2.5 py-1 font-bold text-gold hover:bg-gold hover:text-black"
                  >
                    몸값 수정
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  )
}