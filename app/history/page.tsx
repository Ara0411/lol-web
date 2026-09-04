import { Trophy, Crown, Ban, Swords, Timer, Star } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonBadge } from '@/components/ui/neon-badge'
import { TeamLogo } from '@/components/team-logo'
import { PageTitle } from '@/components/page-title'
import { MATCH_HISTORY, type MatchLog } from '@/lib/data'

function ChampChip({ name, banned }: { name: string; banned?: boolean }) {
  return (
    <span
      className={
        banned
          ? 'relative inline-flex items-center rounded-md border border-danger/30 bg-danger/5 px-2 py-1 text-[11px] font-medium text-danger/80 line-through'
          : 'inline-flex items-center rounded-md border border-border bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-foreground'
      }
    >
      {name}
    </span>
  )
}

function MatchLogCard({ match }: { match: MatchLog }) {
  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-white/[0.02] px-5 py-4">
        <div className="flex items-center gap-3">
          <TeamLogo name={match.winner} size={40} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-cyan">{match.winner}</span>
              <NeonBadge tone="gold">
                <Trophy className="size-3" /> Winner
              </NeonBadge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              defeated {match.loser} · {match.scoreLine}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-2.5 py-1.5">
            <Crown className="size-3.5 text-gold" />
            <div className="leading-tight">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">MVP</p>
              <p className="text-xs font-bold text-gold">
                {match.mvp.name}{' '}
                <span className="font-normal text-muted-foreground">
                  {match.mvp.champ} · {match.mvp.kda}
                </span>
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <Timer className="size-3.5" /> {match.duration}
            <span className="ml-2 font-mono">{match.date}</span>
          </div>
        </div>
      </div>

      {/* Body: picks + bans */}
      <div className="grid gap-5 p-5 lg:grid-cols-2">
        {/* Picks */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Swords className="size-3.5 text-cyan" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Picks
            </span>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg border border-cyan/20 bg-cyan/[0.04] p-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-cyan">
                  Blue · {match.winner}
                </span>
                <span className="font-display text-xs font-bold text-cyan">{match.kdaBlue}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {match.picks.blue.map((c) => (
                  <ChampChip key={c} name={c} />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-danger/20 bg-danger/[0.04] p-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-danger">
                  Red · {match.loser}
                </span>
                <span className="font-display text-xs font-bold text-danger">{match.kdaRed}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {match.picks.red.map((c) => (
                  <ChampChip key={c} name={c} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bans */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Ban className="size-3.5 text-danger" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              10 Bans
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {match.bans.map((c, i) => (
              <ChampChip key={`${c}-${i}`} name={c} banned />
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <PageTitle
        overline="Results · Draft Analysis"
        title="Match History & Pick/Ban"
        subtitle="경기 결과, MVP, 밴/픽 조합과 KDA 요약을 한눈에. 각 매치의 밴픽 데이터를 분석하세요."
      />
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { label: 'Matches Played', value: '48', Icon: Swords, tone: 'text-cyan' },
          { label: 'Champions Banned', value: '312', Icon: Ban, tone: 'text-danger' },
          { label: 'MVP Awards', value: '48', Icon: Star, tone: 'text-gold' },
        ].map((s) => (
          <GlassCard key={s.label} className="flex items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-lg bg-white/5">
              <s.Icon className={`size-5 ${s.tone}`} />
            </span>
            <div>
              <p className="font-display text-xl font-black tabular-nums">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>
      <div className="space-y-5">
        {MATCH_HISTORY.map((m) => (
          <MatchLogCard key={m.id} match={m} />
        ))}
      </div>
    </div>
  )
}
