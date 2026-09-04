import Link from 'next/link'
import {
  Play,
  ExternalLink,
  Mail,
  Target,
  Trophy,
  Radio,
  ArrowLeftRight,
  Copy,
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

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border grid-bg">
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-transparent" />
        <div className="relative flex flex-col gap-4 p-6 sm:p-10">
          <div className="flex items-center gap-2">
            <NeonBadge tone="danger" className="animate-live">
              <Radio className="size-3" /> Live Now
            </NeonBadge>
            <NeonBadge tone="gold">
              <Trophy className="size-3" /> Season 5
            </NeonBadge>
          </div>
          <h1 className="max-w-2xl font-display text-4xl font-black uppercase leading-none tracking-tight text-balance sm:text-6xl">
            <span className="text-glow-cyan text-cyan">LoL-Eiter</span> Inner League
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
            롤이터 커뮤니티 공식 이너 리그. 실시간 중계, 대진표, 선수 카드, 이적 시장까지 —
            소환사의 협곡을 지배할 준비가 되었는가?
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-background transition-transform hover:-translate-y-0.5 neon-cyan-glow"
            >
              <Trophy className="size-4" /> View Brackets
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live stream */}
        <GlassCard className="lg:col-span-2 overflow-hidden">
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
              <Play className="size-3.5 fill-white" /> Watch on YouTube
              <ExternalLink className="size-3.5" />
            </a>
          </div>
          <div className="relative aspect-video w-full bg-black">
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

        {/* Right column */}
        <div className="space-y-6">
          {/* Goal countdown */}
          <GlassCard className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="size-4 text-gold" />
              <h2 className="font-display text-sm font-bold uppercase tracking-wide">
                Launch Goal
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              공식 리그 출범까지 남은 멤버 목표
            </p>
            <div className="mt-4 flex items-end justify-between">
              <span className="font-display text-3xl font-black text-gold">
                {MEMBERS.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                / {GOAL.toLocaleString()} Members
              </span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-cyan gold-glow"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-right text-xs font-semibold text-gold">{pct}% reached</p>
          </GlassCard>

          {/* Admin contact */}
          <GlassCard className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Mail className="size-4 text-cyan" />
              <h2 className="font-display text-sm font-bold uppercase tracking-wide">
                Admin Contact
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              선수 / 팀 문의는 공식 운영진 이메일로 연락 주세요.
            </p>
            <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-cyan/30 bg-cyan/5 px-3 py-2.5">
              <span className="font-mono text-sm text-cyan">admin@lol-eiter.com</span>
              <a
                href="mailto:admin@lol-eiter.com"
                className="grid size-7 place-items-center rounded-md bg-cyan/15 text-cyan transition-colors hover:bg-cyan/25"
                aria-label="Email admin"
              >
                <Copy className="size-3.5" />
              </a>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Standings snapshot */}
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-gold" />
            <h2 className="font-display text-sm font-bold uppercase tracking-wide">
              Team Point Standings
            </h2>
          </div>
          <Link
            href="/transfer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan hover:underline"
          >
            <ArrowLeftRight className="size-3.5" /> Transfer Market
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {standings.map((team, i) => (
            <div
              key={team.id}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-white/[0.02] p-3"
            >
              <span
                className="font-display text-lg font-black"
                style={{ color: i === 0 ? '#f5c451' : '#8b93ad' }}
              >
                {i + 1}
              </span>
              <TeamLogo name={team.name} size={34} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{team.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {team.points.toLocaleString()} pts
                </p>
              </div>
              {i === 0 ? <NeonBadge tone="gold">1st</NeonBadge> : null}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
