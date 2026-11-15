import { AlertTriangle, Ban, Info } from 'lucide-react'

/* ------------------------------------------------------------------
 * 서버 & 내전 규칙 — 내용 수정은 아래 상수만 바꾸면 돼요
 * ------------------------------------------------------------------ */

const NOTICE = [
  '공지 미숙지로 인한 불이익은 관리자가 책임지지 않습니다.',
  '규칙 위반 문의 및 서버 관련 문의사항은 관리자 DM으로 보내주세요.',
]

type RuleItem = { text: string; sub?: string; warn?: boolean }

const SECTIONS: { title: string; items: RuleItem[] }[] = [
  {
    title: '필수 서버 규칙',
    items: [
      { text: '가입 조건: 만 18세 이상만 이용 가능' },
      { text: '지인 초대: 초대 시 지원서에 지인 명시 필수' },
      { text: '경고 제재: 경고 2회 누적 시 추방', sub: '1개월 클린 활동 시 1회 차감', warn: true },
    ],
  },
  {
    title: '티어 & 밸런스 규정',
    items: [
      {
        text: '마스터 600점 이상: 상대팀에 ±200점대 맞밸런스 필수',
        sub: '라인이 달라도 가능',
      },
      { text: '위장 티어 적발: 즉시 해당 경기 중단(쫑) 및 추방', warn: true },
    ],
  },
  {
    title: '내전 진행 & 밴픽 규정',
    items: [
      { text: '경기 방식: 3판 2선승제 / 라인 스왑 금지' },
      { text: '하드 피어리스(하피) 적용' },
      { text: '저격 밴 제한: 다이아 이하 최대 3개', sub: '마스터 이상은 제한 없음' },
      {
        text: '포지션 외 픽: 주 라인을 벗어난 픽은 팀원 양해 후 진행',
        sub: '예: 탑 진, 미드 케이틀린',
      },
      { text: '취소 규정: 오후 8시 이후, 참가 후 30분 이내 취소 불가', warn: true },
    ],
  },
]

const WARNINGS = [
  '오후 8시 이후 시작 30분 전 취소',
  '참가하기 누르고 잠수',
  '소통 거부 (입꾹닫)',
  '팀원에게 밴·픽 강요',
  '게임 내 감정표현·이모티콘 사용',
  '관전자 마이크 사용',
  '관리자와 상의 없이 맞밸 없는 내전 참가',
  '게임 승리를 목적으로 두지 않은 팀원 사기 저하 발언 및 행동',
]
const WARNING_EXAMPLE = '예: 게임 내 의도적인 한숨, "서렌치죠?", "이걸 왜 함?", "어차피 진 듯" 등'

const BANS = ['티어 속이기 (위장 티어)', '사전 협의 없는 서버 인원 외부 유출', '리플레이 틀어놓고 타인 조롱']

const FOOTNOTE =
  '본 공지에 명시되지 않은 사항이라도, 서버 분위기를 저해하거나 타인에게 피해를 주는 행위는 관리자 합의하에 제재될 수 있습니다.'

/* ------------------------------------------------------------------ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-5 w-[3px] rounded-full bg-gradient-to-b from-gold to-gold/20" />
      <h2 className="font-serif text-xl font-extrabold">{children}</h2>
    </div>
  )
}

export default function RulesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-12">
      {/* header */}
      <header className="pt-4 text-center">
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">서버 & 내전 규칙</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          모두가 즐겁게 게임할 수 있도록, 참여 전 꼭 읽어주세요.
        </p>
      </header>

      {/* notice */}
      <div className="flex gap-3 rounded-2xl border border-cyan/25 bg-cyan/[0.06] p-5">
        <Info className="mt-0.5 size-5 shrink-0 text-cyan" strokeWidth={1.6} />
        <div className="space-y-1.5 text-sm leading-relaxed text-foreground/90">
          {NOTICE.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>

      {/* main rule sections */}
      {SECTIONS.map((sec) => (
        <section key={sec.title} className="glass rounded-2xl p-6 sm:p-8">
          <SectionTitle>{sec.title}</SectionTitle>
          <ul className="space-y-3">
            {sec.items.map((it) => (
              <li
                key={it.text}
                className={
                  it.warn
                    ? 'rounded-xl border border-danger/25 bg-danger/[0.07] px-4 py-3'
                    : 'rounded-xl bg-white/[0.03] px-4 py-3'
                }
              >
                <p className={it.warn ? 'text-sm font-semibold text-danger' : 'text-sm font-medium text-foreground/90'}>
                  {it.text}
                </p>
                {it.sub ? <p className="mt-1 text-xs text-muted-foreground">{it.sub}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* warnings & bans */}
      <section className="glass rounded-2xl p-6 sm:p-8">
        <SectionTitle>경고 및 추방 기준</SectionTitle>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
              <AlertTriangle className="size-4" strokeWidth={1.8} /> 경고 항목
            </p>
            <ul className="space-y-2">
              {WARNINGS.map((w, i) => (
                <li key={w} className="flex gap-3 rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm">
                  <span className="mt-0.5 font-serif text-xs font-extrabold text-gold/80">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-foreground/90">
                    {w}
                    {i === WARNINGS.length - 1 ? (
                      <span className="mt-1 block text-xs text-muted-foreground">{WARNING_EXAMPLE}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-danger">
              <Ban className="size-4" strokeWidth={1.8} /> 즉시 추방 항목
            </p>
            <ul className="space-y-2">
              {BANS.map((b) => (
                <li
                  key={b}
                  className="rounded-xl border border-danger/25 bg-danger/[0.07] px-4 py-2.5 text-sm font-semibold text-danger"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <p className="px-2 text-center text-xs leading-relaxed text-muted-foreground">{FOOTNOTE}</p>
    </div>
  )
}