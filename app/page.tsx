'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Coins,
  Headphones,
  Sparkles,
  Swords,
  Trophy,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
 * 서버 정보 — 여기만 바꾸면 홈 전체에 반영돼요
 * ------------------------------------------------------------------ */
const SERVER = {
  name: '여운',
  banner: '/yeoun-banner.jpg',
  tagline: '같이 하면 더 재밌는 롤, 매일 열리는 내전 서버',
  invite: process.env.NEXT_PUBLIC_DISCORD_INVITE || 'https://discord.gg/your-invite',
  // 디스코드 서버 설정 → 위젯 → "서버 위젯 사용" 을 켜면 실시간 접속자 수가 표시돼요
  guildId: process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || '',
}

const FEATURES = [
  {
    icon: Swords,
    title: '매일 열리는 내전',
    desc: '내전 봇이 모집부터 팀 구성, 결과 기록까지 자동으로. 버튼 한 번이면 참가 완료.',
  },
  {
    icon: Coins,
    title: '포인트 & 상점',
    desc: '내전을 끝낼 때마다 포인트가 쌓여요. 모은 포인트로 상점에서 보상을 받아가세요.',
  },
  {
    icon: Trophy,
    title: '시즌 리그전',
    desc: '팀을 꾸려 참가하는 멸망전 리그. 대진표, 선수 카드, 이적 시장까지 사이트에서 확인.',
  },
  {
    icon: Headphones,
    title: '음성 채널 & 듀오',
    desc: '솔랭 듀오, 자랭 5인큐, 칼바람까지. 언제 들어와도 같이 할 사람이 있어요.',
  },
]

const STEPS = [
  { title: '서버 참여', desc: '아래 버튼으로 디스코드 서버에 들어와요.' },
  { title: '닉네임 인증', desc: '롤 닉네임과 티어·포지션을 등록해요.' },
  { title: '내전 참가', desc: '모집 채널에서 버튼을 눌러 바로 참가!' },
]

// 홈에는 핵심만 — 전체 규칙은 app/rules/page.tsx
const RULES = [
  '만 18세 이상만 이용할 수 있어요. 지인 초대 시 지원서에 지인을 꼭 적어주세요.',
  '경고 2회 누적 시 추방돼요. (1개월 클린 활동 시 1회 차감)',
  '위장 티어가 적발되면 해당 경기 중단(쫑) 후 즉시 추방돼요.',
  '오후 8시 이후에는 참가 후 30분 이내 취소할 수 없어요.',
  '내전은 3판 2선승제, 하드 피어리스로 진행해요.',
]

const FAQ = [
  {
    q: '티어가 낮아도 내전에 참가할 수 있나요?',
    a: '물론이에요. 티어 상관없이 참가할 수 있고, 팀은 밸런스를 맞춰서 나눠요. 마스터 600점 이상은 상대팀과 ±200점대 맞밸런스가 필수예요.',
  },
  {
    q: '포인트는 어떻게 모으나요?',
    a: '내전을 완료하면 포인트 봇이 자동으로 보상을 지급해요. 모은 포인트는 서버 상점에서 쓸 수 있어요.',
  },
  {
    q: '리그전은 누구나 나갈 수 있나요?',
    a: '시즌마다 참가 신청을 받아요. 일정과 규정은 공지 채널과 사이트의 리그 페이지에서 확인할 수 있어요.',
  },
  {
    q: '문제가 생기면 어디에 말하나요?',
    a: '규칙 위반 문의와 서버 관련 문의는 관리자 DM으로 보내주세요.',
  },
]


/* ------------------------------------------------------------------ */

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function JoinButton({ size = 'lg' }: { size?: 'lg' | 'md' }) {
  return (
    <a
      href={SERVER.invite}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-xl bg-[#5865F2] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#4752c4]',
        'shadow-[0_0_32px_-8px_#5865F2]',
        size === 'lg' ? 'px-6 py-3.5 text-base' : 'px-5 py-3 text-sm',
      )}
    >
      <DiscordIcon className="size-5" />
      디스코드 참여하기
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  )
}

export default function HomePage() {
  const [online, setOnline] = useState<number | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // 디스코드 서버 위젯이 켜져 있으면 실시간 접속자 수 가져오기
  useEffect(() => {
    if (!SERVER.guildId) return
    fetch(`https://discord.com/api/guilds/${SERVER.guildId}/widget.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && typeof d.presence_count === 'number' && setOnline(d.presence_count))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-20 pb-12 sm:space-y-28">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
        {/* 배너 이미지 (서버 이름이 이미지에 들어가 있어요) */}
        <div className="relative aspect-[16/9] w-full sm:aspect-[16/8] lg:aspect-[16/7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SERVER.banner}
            alt={`${SERVER.name} 디스코드 서버`}
            className="absolute inset-0 size-full object-cover object-[50%_45%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/60 to-transparent" />

          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md sm:left-6 sm:top-6">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            {online !== null ? (
              <>
                지금 <strong className="text-white">{online.toLocaleString()}명</strong> 접속 중
              </>
            ) : (
              <>리그 오브 레전드 디스코드 커뮤니티</>
            )}
          </span>
        </div>

        <div className="relative -mt-10 flex flex-col items-center px-6 pb-12 text-center sm:-mt-16">
          <p className="max-w-lg font-serif text-lg font-bold leading-relaxed text-foreground/90 sm:text-xl">
            {SERVER.tagline}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <JoinButton />
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-6 py-3.5 text-base font-bold backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#c7d2fe]/40"
            >
              서버 둘러보기
            </a>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="scroll-mt-24">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">여운에서 할 수 있는 것</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass glass-hover rounded-2xl p-6">
              <span className="mb-5 grid size-12 place-items-center rounded-full bg-gradient-to-b from-cyan/15 to-transparent ring-1 ring-cyan/20 shadow-[0_0_24px_-8px_rgba(var(--glow),0.6)]">
                <Icon className="size-[22px] text-[#dbe4ff]" strokeWidth={1.4} />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW TO JOIN ================= */}
      <section>
        <div className="mb-10 text-center">
          <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">3단계면 바로 시작</h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ title, desc }, i) => (
            <li key={title} className="glass relative overflow-hidden rounded-2xl p-6">
              <span className="font-serif text-4xl font-extrabold text-gold/90">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-3 block h-px w-10 bg-gradient-to-r from-gold/60 to-transparent" />
              <h3 className="mt-4 text-base font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ================= RULES + FAQ ================= */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-5 w-[3px] rounded-full bg-gradient-to-b from-gold to-gold/20" />
            <h2 className="font-serif text-lg font-extrabold">서버 기본 규칙</h2>
          </div>
          <ul className="space-y-3">
            {RULES.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/5 font-mono text-[10px] font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <span className="text-foreground/85">{r}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/rules"
            className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-cyan"
          >
            전체 규칙 보기 <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-5 w-[3px] rounded-full bg-gradient-to-b from-gold to-gold/20" />
            <h2 className="font-serif text-lg font-extrabold">자주 묻는 질문</h2>
          </div>
          <div className="divide-y divide-border">
            {FAQ.map((f, i) => {
              const open = openFaq === i
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-bold"
                    aria-expanded={open}
                  >
                    {f.q}
                    <ChevronDown
                      className={cn('size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300',
                      open ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-[#5865F2]/30 bg-gradient-to-br from-[#5865F2]/20 via-card to-gold/10 px-6 py-14 text-center">
        <Sparkles className="mx-auto mb-4 size-8 text-gold" />
        <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">오늘 내전, 같이 하실래요?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          혼자 돌리는 솔랭 말고, 같이 웃고 떠드는 롤. 지금 바로 들어오세요.
        </p>
        <div className="mt-8 flex justify-center">
          <JoinButton size="md" />
        </div>
      </section>
    </div>
  )
}