export type Position = 'TOP' | 'JG' | 'MID' | 'ADC' | 'SUP'
export type Tier =
  | 'Iron'
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Emerald'
  | 'Diamond'
  | 'Master'
  | 'Grandmaster'
  | 'Challenger'

export const POSITION_META: Record<
  Position,
  { label: string; ko: string; color: string; ring: string }
> = {
  TOP: { label: 'TOP', ko: '탑', color: '#f5c451', ring: 'rgba(245,196,81,0.5)' },
  JG: { label: 'JG', ko: '정글', color: '#34d399', ring: 'rgba(52,211,153,0.5)' },
  MID: { label: 'MID', ko: '미드', color: '#22d3ee', ring: 'rgba(34,211,238,0.5)' },
  ADC: { label: 'ADC', ko: '원딜', color: '#f43f5e', ring: 'rgba(244,63,94,0.5)' },
  SUP: { label: 'SUP', ko: '서폿', color: '#a855f7', ring: 'rgba(168,85,247,0.5)' },
}

export const TIER_COLOR: Record<Tier, string> = {
  Iron: '#7c7c7c',
  Bronze: '#a97142',
  Silver: '#9fb1c4',
  Gold: '#f5c451',
  Platinum: '#3fbfb0',
  Emerald: '#2ecc71',
  Diamond: '#5aa9ff',
  Master: '#c084fc',
  Grandmaster: '#f87171',
  Challenger: '#22d3ee',
}

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface PlayerCard {
  id: string
  summoner: string
  ko: string
  team: string
  position: Position
  tier: Tier
  lp: number
  salaryCap: number
  overall: number
  rarity: Rarity
  title: string
  stats: { kda: number; winRate: number; csm: number; dpm: number; kp: number }
}

export const TEAMS = [
  { id: 't1', name: 'Void Predators', short: 'VP', color: '#22d3ee', points: 4200, logo: 'VP' },
  { id: 't2', name: 'Neon Serpents', short: 'NS', color: '#a855f7', points: 3850, logo: 'NS' },
  { id: 't3', name: 'Gold Vanguard', short: 'GV', color: '#f5c451', points: 5100, logo: 'GV' },
  { id: 't4', name: 'Crimson Order', short: 'CO', color: '#f43f5e', points: 2900, logo: 'CO' },
  { id: 't5', name: 'Emerald Hunters', short: 'EH', color: '#34d399', points: 3600, logo: 'EH' },
  { id: 't6', name: 'Azure Phantoms', short: 'AP', color: '#5aa9ff', points: 4700, logo: 'AP' },
]

export const PLAYER_CARDS: PlayerCard[] = [
  {
    id: 'p1', summoner: 'ZenithFang', ko: '제니스', team: 'Gold Vanguard', position: 'TOP',
    tier: 'Challenger', lp: 1204, salaryCap: 98, overall: 96, rarity: 'legendary',
    title: '협곡의 지배자',
    stats: { kda: 5.8, winRate: 71, csm: 9.2, dpm: 612, kp: 64 },
  },
  {
    id: 'p2', summoner: 'NightReaper', ko: '나이트', team: 'Void Predators', position: 'JG',
    tier: 'Grandmaster', lp: 890, salaryCap: 92, overall: 93, rarity: 'epic',
    title: '정글의 폭군',
    stats: { kda: 4.9, winRate: 66, csm: 6.1, dpm: 458, kp: 78 },
  },
  {
    id: 'p3', summoner: 'ArcaneMuse', ko: '아르케인', team: 'Neon Serpents', position: 'MID',
    tier: 'Challenger', lp: 1102, salaryCap: 95, overall: 95, rarity: 'legendary',
    title: '마법의 화신',
    stats: { kda: 6.2, winRate: 69, csm: 9.8, dpm: 705, kp: 61 },
  },
  {
    id: 'p4', summoner: 'StormArrow', ko: '스톰', team: 'Azure Phantoms', position: 'ADC',
    tier: 'Grandmaster', lp: 760, salaryCap: 90, overall: 91, rarity: 'epic',
    title: '폭풍의 사수',
    stats: { kda: 5.1, winRate: 63, csm: 10.4, dpm: 668, kp: 58 },
  },
  {
    id: 'p5', summoner: 'AegisWard', ko: '이지스', team: 'Emerald Hunters', position: 'SUP',
    tier: 'Master', lp: 540, salaryCap: 84, overall: 88, rarity: 'rare',
    title: '수호의 방패',
    stats: { kda: 4.3, winRate: 60, csm: 1.2, dpm: 214, kp: 72 },
  },
  {
    id: 'p6', summoner: 'IronClad', ko: '아이언', team: 'Crimson Order', position: 'TOP',
    tier: 'Diamond', lp: 320, salaryCap: 76, overall: 82, rarity: 'rare',
    title: '불굴의 벽',
    stats: { kda: 3.6, winRate: 55, csm: 8.4, dpm: 489, kp: 51 },
  },
  {
    id: 'p7', summoner: 'PhantomDash', ko: '팬텀', team: 'Void Predators', position: 'MID',
    tier: 'Diamond', lp: 410, salaryCap: 79, overall: 84, rarity: 'common',
    title: '그림자 무희',
    stats: { kda: 4.0, winRate: 57, csm: 9.1, dpm: 574, kp: 55 },
  },
  {
    id: 'p8', summoner: 'FrostBite', ko: '프로스트', team: 'Neon Serpents', position: 'ADC',
    tier: 'Master', lp: 610, salaryCap: 86, overall: 89, rarity: 'epic',
    title: '한파의 궁수',
    stats: { kda: 5.5, winRate: 64, csm: 10.1, dpm: 690, kp: 59 },
  },
]

export interface FreeAgent {
  id: string
  summoner: string
  position: Position
  tier: Tier
  askingPoints: number
  overall: number
  lastTeam: string
  note: string
}

export const FREE_AGENTS: FreeAgent[] = [
  { id: 'fa1', summoner: 'BlazeKnight', position: 'TOP', tier: 'Diamond', askingPoints: 650, overall: 83, lastTeam: 'Crimson Order', note: '주챔 오른 · 카밀' },
  { id: 'fa2', summoner: 'SilentJinx', position: 'ADC', tier: 'Master', askingPoints: 900, overall: 88, lastTeam: 'Free Agent', note: '한타 캐리형 원딜' },
  { id: 'fa3', summoner: 'HexGamble', position: 'JG', tier: 'Diamond', askingPoints: 720, overall: 85, lastTeam: 'Emerald Hunters', note: '초반 갱킹 특화' },
  { id: 'fa4', summoner: 'LunarVeil', position: 'SUP', tier: 'Platinum', askingPoints: 480, overall: 78, lastTeam: 'Azure Phantoms', note: '로밍형 서포터' },
  { id: 'fa5', summoner: 'VoidCaller', position: 'MID', tier: 'Grandmaster', askingPoints: 1050, overall: 90, lastTeam: 'Free Agent', note: '로밍/암살 메이지' },
]

export interface Trade {
  id: string
  time: string
  from: string
  to: string
  player: string
  points: number
  type: 'trade' | 'signing' | 'release'
}

export const TRADE_FEED: Trade[] = [
  { id: 'tr1', time: '2h ago', from: 'Crimson Order', to: 'Gold Vanguard', player: 'ZenithFang', points: 1200, type: 'trade' },
  { id: 'tr2', time: '5h ago', from: 'Free Agent', to: 'Neon Serpents', player: 'FrostBite', points: 860, type: 'signing' },
  { id: 'tr3', time: '1d ago', from: 'Azure Phantoms', to: 'Free Agent', player: 'LunarVeil', points: 0, type: 'release' },
  { id: 'tr4', time: '2d ago', from: 'Emerald Hunters', to: 'Void Predators', player: 'HexGamble', points: 700, type: 'trade' },
]

export interface ScheduleMatch {
  id: string
  day: string
  time: string
  teamA: string
  teamB: string
  round: string
  status: 'upcoming' | 'live' | 'done'
  scoreA?: number
  scoreB?: number
}

export const SCHEDULE: ScheduleMatch[] = [
  { id: 's1', day: 'MON', time: '20:00', teamA: 'Gold Vanguard', teamB: 'Crimson Order', round: 'Week 5 · R1', status: 'live', scoreA: 1, scoreB: 0 },
  { id: 's2', day: 'MON', time: '21:30', teamA: 'Void Predators', teamB: 'Emerald Hunters', round: 'Week 5 · R1', status: 'upcoming' },
  { id: 's3', day: 'WED', time: '20:00', teamA: 'Neon Serpents', teamB: 'Azure Phantoms', round: 'Week 5 · R2', status: 'upcoming' },
  { id: 's4', day: 'WED', time: '21:30', teamA: 'Gold Vanguard', teamB: 'Void Predators', round: 'Week 5 · R2', status: 'upcoming' },
  { id: 's5', day: 'FRI', time: '20:00', teamA: 'Crimson Order', teamB: 'Neon Serpents', round: 'Week 5 · R3', status: 'upcoming' },
  { id: 's6', day: 'SUN', time: '19:00', teamA: 'Emerald Hunters', teamB: 'Azure Phantoms', round: 'Week 5 · R3', status: 'upcoming' },
]

export interface BracketSlot {
  teamA: { name: string; score: number | null }
  teamB: { name: string; score: number | null }
}

export const BRACKET = {
  quarterfinals: [
    { teamA: { name: 'Gold Vanguard', score: 3 }, teamB: { name: 'Crimson Order', score: 1 } },
    { teamA: { name: 'Void Predators', score: 3 }, teamB: { name: 'Emerald Hunters', score: 2 } },
    { teamA: { name: 'Neon Serpents', score: 3 }, teamB: { name: 'Iron Wolves', score: 0 } },
    { teamA: { name: 'Azure Phantoms', score: 2 }, teamB: { name: 'Shadow Legion', score: 3 } },
  ] as BracketSlot[],
  semifinals: [
    { teamA: { name: 'Gold Vanguard', score: 3 }, teamB: { name: 'Void Predators', score: 2 } },
    { teamA: { name: 'Neon Serpents', score: 1 }, teamB: { name: 'Shadow Legion', score: 3 } },
  ] as BracketSlot[],
  finals: [
    { teamA: { name: 'Gold Vanguard', score: null }, teamB: { name: 'Shadow Legion', score: null } },
  ] as BracketSlot[],
}

export interface MatchLog {
  id: string
  date: string
  duration: string
  winner: string
  loser: string
  scoreLine: string
  mvp: { name: string; kda: string; champ: string }
  bans: string[]
  picks: { blue: string[]; red: string[] }
  kdaBlue: string
  kdaRed: string
}

export const MATCH_HISTORY: MatchLog[] = [
  {
    id: 'm1', date: 'Feb 06', duration: '34:12', winner: 'Gold Vanguard', loser: 'Crimson Order',
    scoreLine: '21 / 9 / 48', mvp: { name: 'ZenithFang', kda: '8/1/6', champ: 'Aatrox' },
    bans: ['Yone', 'Kai\'Sa', 'Nautilus', 'Ahri', 'Lee Sin', 'Jax', 'Vi', 'Xayah', 'Rell', 'Orianna'],
    picks: {
      blue: ['Aatrox', 'Sejuani', 'Azir', 'Aphelios', 'Braum'],
      red: ['Renekton', 'Wukong', 'Sylas', 'Zeri', 'Lulu'],
    },
    kdaBlue: '21 / 9 / 48', kdaRed: '9 / 21 / 22',
  },
  {
    id: 'm2', date: 'Feb 05', duration: '41:55', winner: 'Void Predators', loser: 'Emerald Hunters',
    scoreLine: '18 / 14 / 40', mvp: { name: 'NightReaper', kda: '6/2/14', champ: 'Vi' },
    bans: ['Aatrox', 'Azir', 'Vi', 'Milio', 'Zeri', 'Sejuani', 'Ksante', 'Varus', 'Ashe', 'Taliyah'],
    picks: {
      blue: ['Renekton', 'Vi', 'Orianna', 'Jinx', 'Thresh'],
      red: ['Gnar', 'Maokai', 'Corki', 'Kai\'Sa', 'Nautilus'],
    },
    kdaBlue: '18 / 14 / 40', kdaRed: '14 / 18 / 33',
  },
  {
    id: 'm3', date: 'Feb 03', duration: '28:40', winner: 'Neon Serpents', loser: 'Azure Phantoms',
    scoreLine: '25 / 6 / 55', mvp: { name: 'ArcaneMuse', kda: '9/1/10', champ: 'Sylas' },
    bans: ['Sylas', 'Lee Sin', 'Jinx', 'Rell', 'Camille', 'Yone', 'Poppy', 'Caitlyn', 'Karma', 'Viego'],
    picks: {
      blue: ['Jax', 'Viego', 'Sylas', 'Xayah', 'Rakan'],
      red: ['Ksante', 'Sejuani', 'Ahri', 'Lucian', 'Nami'],
    },
    kdaBlue: '25 / 6 / 55', kdaRed: '6 / 25 / 14',
  },
]

export interface ScrimRoom {
  id: string
  name: string
  host: string
  slots: number
  filled: number
  tier: string
  mode: string
  status: 'waiting' | 'in-game' | 'full'
  note: string
}

export const SCRIM_ROOMS: ScrimRoom[] = [
  { id: 'sc1', name: 'Scrim Room #1', host: 'ZenithFang', slots: 10, filled: 8, tier: 'Master+', mode: '5v5 Best of 3', status: 'waiting', note: '풀 5인 팀 우선' },
  { id: 'sc2', name: 'Scrim Room #2', host: 'NightReaper', slots: 10, filled: 10, tier: 'Diamond+', mode: '5v5 Single', status: 'in-game', note: '경기 진행중' },
  { id: 'sc3', name: 'Scrim Room #3', host: 'AegisWard', slots: 10, filled: 4, tier: 'Platinum+', mode: '5v5 Best of 5', status: 'waiting', note: '서폿/정글 구인' },
  { id: 'sc4', name: 'Scrim Room #4', host: 'FrostBite', slots: 10, filled: 6, tier: 'Emerald+', mode: 'Draft Practice', status: 'waiting', note: '밴픽 연습' },
  { id: 'sc5', name: 'Scrim Room #5', host: 'IronClad', slots: 10, filled: 10, tier: 'Gold+', mode: '5v5 Single', status: 'full', note: '마감' },
]

export const SHOP_ITEMS = [
  { id: 'sh1', name: 'Challenger Aura', ko: '챌린저 오라', type: 'Animated Background', rarity: 'legendary' as Rarity, price: 2400, preview: 'radial-gradient(circle at 50% 0%, rgba(34,211,238,0.5), transparent 60%)' },
  { id: 'sh2', name: 'Gold Prestige Frame', ko: '골드 프레스티지', type: 'Card Frame', rarity: 'legendary' as Rarity, price: 3200, preview: 'linear-gradient(135deg, #f5c451, #b8860b)' },
  { id: 'sh3', name: 'Neon Circuit Border', ko: '네온 서킷', type: 'Border', rarity: 'epic' as Rarity, price: 1600, preview: 'linear-gradient(135deg, #22d3ee, #a855f7)' },
  { id: 'sh4', name: 'Void Pulse BG', ko: '보이드 펄스', type: 'Animated Background', rarity: 'epic' as Rarity, price: 1800, preview: 'radial-gradient(circle at 30% 30%, rgba(168,85,247,0.55), transparent 60%)' },
  { id: 'sh5', name: 'Crimson Edge Frame', ko: '크림슨 엣지', type: 'Card Frame', rarity: 'rare' as Rarity, price: 900, preview: 'linear-gradient(135deg, #f43f5e, #7f1d2b)' },
  { id: 'sh6', name: 'Emerald Glass Border', ko: '에메랄드 글래스', type: 'Border', rarity: 'rare' as Rarity, price: 800, preview: 'linear-gradient(135deg, #34d399, #0f6e4d)' },
]

export const TITLES = ['협곡의 지배자', '정글의 폭군', '마법의 화신', '폭풍의 사수', '수호의 방패', '불멸의 전설']

export const FAQ = [
  { 
    q: '리그 등록은 어떻게 하나요?', 
    a: 'Discord 서버에 참여한 뒤 #등록 채널에서 소환사명과 포지션, 티어를 인증하면 관리자가 확인 후 리그에 배정합니다. 인증은 관리자가 확인 예정입니다. 인증에 불응 시 서버에서 불이익이 있을 수 있습니다.' 
  },
  { 
    q: '포인트 시스템은 어떻게 작동하나요?', 
    a: '각 팀은 샐러리캡 170점 내에서 팀 구성을 진행해야 하며, 점수 표는 제시 예정입니다. 팀장은 따로 없으며 정해진 날짜까지 팀 구성을 완료하면 됩니다.  점수에 대해 의문이 있으면 관리자에게 문의 바랍니다.' 
  },
  { 
    q: '트레이드 규칙이 궁금해요.', 
    a: '트레이드는 양 팀 팀장의 동의와 운영진 승인이 필요합니다. 트레이드 창은 정해진 날에만 열리며, 샐러리캡을 초과하는 영입은 자동으로 반려됩니다.' 
  },
  { 
    q: '샐러리캡을 초과하면 어떻게 되나요?', 
    a: '팀 전체 선수의 Salary Cap Score 합계가 리그 상한(170)을 초과하면 다음 경기 출전이 제한되며, 교체 전까지 패배 처리 됩니다.' 
  },
  { 
    q: '자유계약(FA) 선수는 언제 영입할 수 있나요?', 
    a: 'FA 선수는 트레이드 창 기간 동안 언제든 영입 가능합니다.  팀내 최대 로스터 인원수는 7명입니다.' 
  },
]

export const RULES = [
  {
    icon: 'pause',
    title: 'Pause & Reschedule / 일시정지 규정',
    items: [
      '팀당 최대 3회, 한판당 5분까지 일시정지 허용',
      '일시정지 사유는 반드시 전체 채팅에 명시해야 함.',
      '일시정지 5분 이후 게임 재개 강제',
      '고의적 지연 또는 사유 미고지 시 운영진 재량으로 게임 재개 강제.',
    ],
  },
  {
    icon: 'coins',
    title: 'Salary Cap Penalties / 샐러리캡 페널티',
    items: [
      '팀 로스터 Salary Cap Score 합계 상한은 170점.',
      '상한 초과 로스터는 경기 출전 불가 및 자동 몰수패 처리.',
      '트레이드는 팀간 상호 합의간에 진행 가능',
      '트레이드로 인한 일시 초과는 24시간 내 해소 시 페널티 면제.',
    ],
  },
  {
    icon: 'ban',
    title: 'Disqualification / 실격 및 몰수',
    items: [
      '대리 게임, 승부조작 적발 시 팀 전체 시즌 실격 및 영구 제명.',
      '경기 무단 불참(No-Show) 2회 누적 시 리그에서 자동 강등.',
      '심판 판정 불복종 및 비매너 행위 반복 시 개인 출전 정지.',
    ],
  },
]
