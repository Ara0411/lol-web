'use client'

import { useState } from 'react'
import { Pause, Coins, Ban, ChevronDown, ShieldAlert, HelpCircle } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { PageTitle } from '@/components/page-title'
import { RULES, FAQ } from '@/lib/data'
import { cn } from '@/lib/utils'

const RULE_ICON = {
  pause: Pause,
  coins: Coins,
  ban: Ban,
} as const

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <GlassCard className="overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="font-display text-sm font-black text-cyan">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-sm font-semibold">{q}</span>
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180 text-cyan',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <p className="border-t border-border/50 px-5 py-4 pl-14 text-sm leading-relaxed text-muted-foreground">
            {a}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}

export default function RulesPage() {
  return (
    <div className="space-y-10">
      <PageTitle
        overline="REFEREE HANDBOOK"
        title="규정 및 자주 묻는 질문 (FAQ)"
        subtitle="심판 및 운영진 관점의 공식 룰북과 자주 묻는 질문입니다. 대회 참가 전 반드시 숙지해 주세요."
      />

      {/* Rulebook */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="size-4 text-danger" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">
            대회 공식 룰북 (Organizer Rulebook)
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {RULES.map((rule) => {
            const Icon = RULE_ICON[rule.icon as keyof typeof RULE_ICON]
            return (
              <GlassCard key={rule.title} className="p-5">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-lg bg-danger/10 text-danger">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="text-sm font-bold leading-tight text-balance">{rule.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {rule.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )
          })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <HelpCircle className="size-4 text-cyan" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">
            자주 묻는 질문 (FAQ)
          </h2>
        </div>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}