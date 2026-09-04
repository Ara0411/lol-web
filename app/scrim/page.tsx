'use client'

import { useState } from 'react'
import { Users, Radio, Gamepad2, Lock, Plus } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonBadge } from '@/components/ui/neon-badge'
import { PageTitle } from '@/components/page-title'
import { SCRIM_ROOMS, type ScrimRoom } from '@/lib/data'
import { cn } from '@/lib/utils'

const STATUS_META: Record<
  ScrimRoom['status'],
  { tone: 'success' | 'danger' | 'muted'; label: string }
> = {
  waiting: { tone: 'success', label: '모집 중' },
  'in-game': { tone: 'danger', label: '경기 중' },
  full: { tone: 'muted', label: '인원 마감' },
}

export default function ScrimPage() {
  const waiting = SCRIM_ROOMS.filter((r) => r.status === 'waiting').length
  const totalPlayers = SCRIM_ROOMS.reduce((a, r) => a + r.filled, 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageTitle
          overline="LIVE PRACTICE"
          title="실시간 스크림 현황"
          subtitle="실시간 스크림 방 및 연습 매칭 현황입니다. 빈자리를 확인하고 팀 연습에 바로 합류하세요."
        />
        <button className="inline-flex items-center gap-2 self-start rounded-lg bg-cyan px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-background transition-transform hover:-translate-y-0.5 neon-cyan-glow sm:self-auto">
          <Plus className="size-4" /> 방 만들기
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: '개설된 총 방', value: SCRIM_ROOMS.length, Icon: Gamepad2, tone: 'text-cyan' },
          { label: '모집 중인 방', value: waiting, Icon: Radio, tone: 'text-success' },
          { label: '참여 중인 인원', value: totalPlayers, Icon: Users, tone: 'text-purple' },
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

      {/* Rooms */}
      <div className="grid gap-4 md:grid-cols-2">
        {SCRIM_ROOMS.map((room) => {
          const meta = STATUS_META[room.status]
          const isFull = room.filled >= room.slots
          return (
            <GlassCard key={room.id} hover className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-cyan/10 text-cyan">
                    <Gamepad2 className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-base font-bold">{room.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      방장 · {room.host} · {room.mode}
                    </p>
                  </div>
                </div>
                <NeonBadge
                  tone={meta.tone}
                  className={room.status === 'in-game' ? 'animate-live' : ''}
                >
                  {room.status === 'in-game' ? <Radio className="size-3" /> : null}
                  {meta.label}
                </NeonBadge>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <NeonBadge tone="purple">{room.tier}</NeonBadge>
                <span className="text-[11px] text-muted-foreground">{room.note}</span>
              </div>

              {/* Slot progress */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">참여 대기 인원</span>
                  <span className="font-display font-bold">
                    <span className={isFull ? 'text-danger' : 'text-cyan'}>{room.filled}</span>
                    <span className="text-muted-foreground"> / {room.slots}</span>
                  </span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: room.slots }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'h-2 flex-1 rounded-full',
                        i < room.filled
                          ? isFull
                            ? 'bg-danger'
                            : 'bg-gradient-to-r from-cyan to-purple'
                          : 'bg-white/8',
                      )}
                    />
                  ))}
                </div>
              </div>

              <button
                disabled={isFull}
                className={cn(
                  'mt-4 w-full rounded-lg py-2.5 text-xs font-bold uppercase tracking-wide transition-all',
                  isFull
                    ? 'cursor-not-allowed border border-border bg-white/5 text-muted-foreground'
                    : 'bg-cyan/15 text-cyan hover:bg-cyan/25',
                )}
              >
                {isFull ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="size-3.5" /> 마감된 방입니다
                  </span>
                ) : (
                  `스크림 참가하기 (${room.slots - room.filled}자리 남음)`
                )}
              </button>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}