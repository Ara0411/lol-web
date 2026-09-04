// components/player-card.tsx
import React from 'react';
import { NeonBadge } from './ui/neon-badge';

interface PlayerCardProps {
  player?: any; // 기존 샵 페이지 호환용
  name?: string;
  avatarUrl?: string;
  tier?: string;
  primaryPosition?: string;
  subPosition?: string;
  winRate?: number;
  totalGames?: number;
  topChampions?: string[];
  destructionScore?: number;
}

export function PlayerCard({
  player,
  name,
  avatarUrl,
  tier,
  primaryPosition,
  subPosition,
  winRate,
  totalGames,
  topChampions,
  destructionScore,
}: PlayerCardProps) {
  // player 객체가 통째로 넘어온 경우 (기존 샵 페이지 호환) 데이터 추출
  const displayName = player?.summoner || name || '무명의소환사';
  const displayAvatar = player?.avatar_url || avatarUrl || '/placeholder-user.jpg';
  const displayTier = player?.tier || tier || 'Emerald';
  const displayPos = player?.position || primaryPosition || 'MID';
  const displaySubPos = player?.subPosition || subPosition || 'SUP';
  const displayWinRate = player?.stats?.winRate ?? winRate ?? 50;
  const displayTotalGames = player?.totalGames ?? totalGames ?? 10;
  const displayChampions = player?.topChampions || topChampions || ['아리', '이즈리얼', '신짜오'];

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card/70 p-4 backdrop-blur-md transition-all hover:border-cyan/50 hover:shadow-[0_0_15px_rgba(2,132,199,0.15)]">
      {/* 상단 프로필 및 티어 정보 */}
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <img
          src={displayAvatar}
          alt={displayName}
          className="h-12 w-12 rounded-full border border-border object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground text-lg">{displayName}</h4>
            {destructionScore !== undefined && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                멸망전 점수: {destructionScore}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <NeonBadge tone="cyan">{displayTier}</NeonBadge>
            <span className="text-xs text-muted-foreground">
              주포: <strong className="text-foreground">{displayPos}</strong> | 부포: <strong className="text-muted-foreground">{displaySubPos}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 전적 및 챔피언 정보 (승률 / 판수 / 주챔 3개) */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-secondary/60 p-2 rounded-lg text-center">
          <div className="text-xs text-muted-foreground">승률</div>
          <div className="font-bold text-emerald-600 dark:text-emerald-400">{displayWinRate}%</div>
        </div>
        <div className="bg-secondary/60 p-2 rounded-lg text-center">
          <div className="text-xs text-muted-foreground">내전 판수</div>
          <div className="font-bold text-foreground">{displayTotalGames}판</div>
        </div>
      </div>

      {/* 주챔피언 3개 */}
    <div className="mt-3">
        <div className="text-xs text-muted-foreground mb-1">주력 챔피언 (Top 3)</div>
      <div className="flex gap-1.5">
          {(displayChampions || []).slice(0, 3).map((champ: string, index: number) => (
          <span
            key={index}
              className="flex-1 bg-secondary/80 text-center text-xs py-1 rounded text-foreground truncate px-1 border border-border/40"
          >
            {champ}
          </span>
        ))}
      </div>
    </div>
    </div>
  );
}