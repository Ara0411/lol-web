// components/player-card.tsx
import React from 'react'
import { NeonBadge } from './ui/neon-badge'

interface PlayerCardProps {
  player?: any
  name?: string
  avatarUrl?: string
  tier?: string
  primaryPosition?: string
  winRate?: number
  totalGames?: number
  topChampions?: string[];
  destructionScore?: number // 멸망전 점수 (OVR 스타일)
}

function getTierTone(tier: string = ''): 'gold' | 'purple' | 'cyan' | 'danger' | 'muted' | 'success' {
  const t = tier.toLowerCase()
  if (t.includes('challenger') || t.includes('gold')) return 'gold'
  if (t.includes('grandmaster')) return 'danger'
  if (t.includes('master')) return 'purple'
  if (t.includes('diamond') || t.includes('platinum')) return 'cyan'
  if (t.includes('emerald')) return 'success'
  return 'muted'
}

export function PlayerCard({
  player,
  name,
  avatarUrl,
  tier,
  primaryPosition,
  winRate,
  totalGames,
  topChampions,
  destructionScore,
}: PlayerCardProps) {
  const displayName = player?.summoner_name || player?.summoner || name || '무명의소환사'
  const displayAvatar = player?.avatar_url || avatarUrl || '/placeholder-user.jpg'
  const displayTier = player?.tier || tier || 'Emerald'
  const displayPos = player?.position || primaryPosition || 'MID'
  
  // 멸망전 점수 (DB의 destruction_score 또는 overall 또는 props)
  const score = player?.destruction_score ?? player?.overall ?? destructionScore ?? 0

  const resolvedWins = player?.stats?.wins ?? player?.wins ?? 0
  const resolvedLosses = player?.stats?.losses ?? player?.losses ?? 0
  const calculatedTotal = resolvedWins + resolvedLosses

  const displayTotalGames = player?.totalGames ?? totalGames ?? calculatedTotal
  const displayWinRate =
    player?.winRate ??
    winRate ??
    (displayTotalGames > 0 ? Math.round((resolvedWins / displayTotalGames) * 100) : 50)

  const displayChampions =
    player?.favorite_champions || player?.topChampions || topChampions || ['미등록', '미등록', '미등록']

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-md transition-all hover:border-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]">
      {/* 우측 상단 OVR 스타일 멸망전 점수 배지 */}
      <div className="absolute top-3 right-3 flex flex-col items-end">
        <div className="flex items-baseline gap-0.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80">점수</span>
          <span className="font-mono text-base font-black text-amber-400">{score}</span>
        </div>
      </div>

      {/* 상단 프로필 및 티어 정보 */}
      <div className="flex items-center gap-3 border-b border-border pb-3.5 pr-14">
        <img
          src={displayAvatar}
          alt={displayName}
          className="h-12 w-12 rounded-full border border-border object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground text-base truncate">{displayName}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            {/* 티어별 색상이 동적으로 적용되는 뱃지 */}
            <NeonBadge tone={getTierTone(displayTier)}>{displayTier}</NeonBadge>
            <span className="text-[11px] text-muted-foreground">
              포지션: <strong className="text-foreground">{displayPos}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 전적 정보 (승률 / 내전 판수) */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-secondary/60 p-2 rounded-xl text-center border border-border/30">
          <div className="text-[11px] text-muted-foreground">승률</div>
          <div className="font-bold text-emerald-500">{displayWinRate}%</div>
        </div>
        <div className="bg-secondary/60 p-2 rounded-xl text-center border border-border/30">
          <div className="text-[11px] text-muted-foreground">내전 판수</div>
          <div className="font-bold text-foreground">{displayTotalGames}판</div>
        </div>
      </div>

      {/* 주력 챔피언 3개 */}
      <div className="mt-3">
        <div className="text-[11px] text-muted-foreground mb-1 font-medium">주력 챔피언</div>
        <div className="flex gap-1.5">
          {displayChampions.slice(0, 3).map((champ: string, index: number) => (
            <span
              key={index}
              className="flex-1 bg-secondary/80 text-center text-xs py-1 rounded-lg text-foreground truncate px-1 border border-border/40"
            >
              {champ || '미등록'}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}