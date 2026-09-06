import Link from 'next/link'
import {
  Play,
  ExternalLink,
  Trophy,
  Radio,
  Flame,
  Users,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonBadge } from '@/components/ui/neon-badge'
import { TeamLogo } from '@/components/team-logo'
import { TEAMS, SCHEDULE } from '@/lib/data'

const MEMBERS = 1000
const GOAL = 1300

export default function HomePage() {
  const pct = Math.round((MEMBERS / GOAL) * 100)
  const live = SCHEDULE.find((m) => m.status === 'live')
  const standings = [...TEAMS].sort((a, b) => b.points - a.points)
  
  // 선수 랭킹 데이터 (lib 에러 방지용 안전한 로컬 배열)
  const topPlayers = [
    { id: '1', summonerName: '탑신병자', kda: 4.8 },
    { id: '2', summonerName: '정글요정', kda: 4.2 },
    { id: '3', summonerName: '미드메이커', kda: 3.9 },
    { id: '4', summonerName: '원딜캐리머신', kda: 3.5 },
    { id: '5', summonerName: '든든서폿', kda: 3.1 },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Hero (LoL-Eiter Inner League 한 줄 일자 배치) */}
      <section className="relative overflow-hidden rounded-2xl border border-border grid-bg">
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-transparent" />
        <div className="relative flex flex-col gap-4 p-6 sm:p-10">
          <h1 className="max-w-4xl font-display text-3xl sm:text-5xl font-black uppercase tracking-tight whitespace-nowrap flex items-center gap-3">
            <span className="text-glow-cyan text-cyan">LoL-Eiter</span> 
            <span>League</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            실시간 중계 · 대진표 · 선수 카드 · 이적 시장 리그의 모든 정보를 한눈에.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-background transition-transform hover:-translate-y-0.5 neon-cyan-glow"
            >
              <Trophy className="size-4" /> 대진표
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg border border-purple/40 bg-purple/10 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-purple transition-transform hover:-translate-y-0.5"
            >
              Player Cards
            </Link>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 그리드 (생중계 칸과 우측 순위표 높이 일치: items-stretch 활용) */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        
        {/* Live stream (좌측 2칸) */}
        <GlassCard className="lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md bg-danger/15 text-danger">
                <Radio className="size-4 animate-live" />
              </span>
              <div>
                <p className="text-sm font-bold">Official Live Broadcast</p>
                <p className="text-[11px] text-muted-foreground">공식 유튜브 생중계</p>
              </div>
            </div>
            <a
              href="https://www.youtube.com/@LeagueofLegends"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF0000] px-3 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              <Play className="size-3.5 fill-white" /> 유튜브에서 보기
              <ExternalLink className="size-3.5" />
            </a>
          </div>
          <div className="relative aspect-video w-full bg-black flex-1">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/live_stream?channel=UC2t5bjwHdUX4vM2g8TRDq5g&autoplay=0"
              title="LoL-Eiter Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {live ? (
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-center gap-2">
                <TeamLogo name={live.teamA} size={28} />
                <span className="text-sm font-semibold">{live.teamA}</span>
              </div>
              <div className="flex items-center gap-2 font-display text-lg font-bold">
                <span className="text-cyan">{live.scoreA}</span>
                <span className="text-muted-foreground">:</span>
                <span>{live.scoreB}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{live.teamB}</span>
                <TeamLogo name={live.teamB} size={28} />
              </div>
            </div>
          ) : null}
        </GlassCard>

        {/* 우상단 순위 카드들 (좌측 라이브 칸 높이에 맞춰 정확히 균등 분할) */}
        <div className="flex flex-col gap-4">
          
          {/* 팀별 순위 카드 */}
          <GlassCard className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="size-4 text-gold" />
                  <h2 className="font-display text-xs font-bold uppercase tracking-wide">
                    팀별 실시간 순위
                  </h2>
                </div>
              </div>
              <div className="space-y-1.5 overflow-y-auto pr-1">
                {standings.map((team, i) => (
                  <div key={team.id} className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-secondary/60 text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gold">{i + 1}</span>
                      <span className="font-semibold truncate max-w-[100px]">{team.name}</span>
                    </div>
                    <span className="font-mono font-bold text-cyan">{team.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* 킬 / 어시 순위 카드 */}
          <GlassCard className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="size-4 text-danger" />
                  <h2 className="font-display text-xs font-bold uppercase tracking-wide">
                    선수 킬 / KDA 순위
                  </h2>
                </div>
              </div>
              <div className="space-y-1.5 overflow-y-auto pr-1">
                {topPlayers.map((player, i) => (
                  <div key={player.id} className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-secondary/60 text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-muted-foreground">{i + 1}</span>
                      <span className="font-semibold truncate max-w-[100px]">{player.summonerName}</span>
                    </div>
                    <span className="font-mono text-muted-foreground">{player.kda} KDA</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

        </div>
      </div>

      {/* 하단 참가 팀 목록 */}
      <GlassCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-cyan" />
            <h2 className="font-display text-base font-bold uppercase tracking-wide">
              참가 팀 목록
            </h2>
          </div>
          <Link
            href="/teams"
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan hover:underline"
          >
            전체 팀 보기 →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TEAMS.map((team) => (
            <div
              key={team.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/40 p-4 transition-transform hover:scale-[1.02]"
            >
              <TeamLogo name={team.name} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{team.name}</p>
                <p className="text-xs text-muted-foreground">
                  포인트: <span className="text-cyan font-bold">{team.points.toLocaleString()}</span> pts
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  )
}