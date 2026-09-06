'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Save, Award, Image as ImageIcon, Swords } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PageTitle } from '@/components/page-title'
import { GlassCard } from '@/components/ui/glass-card'

interface DiscordUser {
  id: string
  username: string
  avatar: string
}

// 자주 쓰이는 주요 챔피언 목록 (필요에 따라 추가/수정 가능)
const POPULAR_CHAMPIONS = [
  "가렌", "갈리오", "갱플랭크", "그라가스", "그레이브즈", "그웬", "나르", "나미", "나서스", "나피리",
  "노틸러스", "녹턴", "누누와 윌럼프", "니달리", "니코", "닐라", "다리우스", "다이애나", "드레이븐", "라이즈",
  "라칸", "람머스", "럭스", "럼블", "레나타 글라스크", "레넥톤", "레오나", "렉사이", "렐", "렝가",
  "루시안", "룰루", "르블랑", "리 신", "리븐", "리산드라", "릴리아", "마스터 이", "마오카이", "말자하",
  "말파이트", "모데카이저", "모르가나", "문도 박사", "미스 포츈", "밀리오", "바드", "바루스", "바이", "베이가",
  "베인", "벡스", "벨베스", "벨코즈", "볼리베어", "브라움", "브라이어", "브랜드", "블라디미르", "블리츠크랭크",
  "비에고", "빅토르", "뽀삐", "사미라", "사이온", "사일러스", "샤코", "세나", "세라핀",
  "세주아니", "세트", "소나", "소라카", "쉔", "쉬바나", "스몰더", "스웨인", "스카너", "시비르",
  "신 짜오", "신드라", "신지드", "쓰레쉬", "아리", "아무무", "아우렐리온 솔", "아이번", "아지르", "아칼리",
  "아크샨", "아트록스", "아펠리오스", "알리스타", "암베사", "애니", "애니비아", "애쉬", "야스오", "에코",
  "엘리스", "오공", "오로라", "오른", "오리아나", "올라프", "요네", "요릭", "우디르", "우르곳",
  "유미", "이렐리아", "이블린", "이즈리얼", "일라오이", "자르반 4세", "자야", "자이라", "자크", "잔나",
  "잭스", "제드", "제라스", "제리", "제이스", "조이", "직스", "진", "질리언", "징크스",
  "초가스", "카르마", "카밀", "카사딘", "카서스", "카시오페아", "카이사", "카직스", "카타리나", "칼리스타",
  "케넨", "케이틀린", "케인", "케일", "코그모", "코르키", "퀸", "크산테", "클레드", "키아나",
  "킨드레드", "타릭", "탈론", "탈리야", "탐 켄치", "트런들", "트린다미어", "트위스티드 페이트", "트위치", "티모",
  "파이크", "판테온", "피들스틱", "피오라", "피즈", "하이머딩거", "헤카림"
]

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    summoner_name: '',
    position: 'MID',
    tier: 'Emerald',
    avatar_url: '', 
    title: '새싹 소환사',
    favorite_champions: ['', '', ''], // 3개 칸
  })

  useEffect(() => {
    const cookies = document.cookie.split(';')
    const userCookie = cookies.find((c) => c.trim().startsWith('discord_user='))
    
    if (!userCookie) {
      alert('로그인이 필요한 페이지입니다!')
      router.push('/')
      return
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
      setUser(userData)
      fetchPlayerProfile(userData.id)
    } catch (e) {
      console.error('유저 정보 파싱 에러', e)
      setLoading(false)
    }
  }, [router])

  const fetchPlayerProfile = async (discordId: string) => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', discordId)
      .single()

    if (data && !error) {
      const champs = data.favorite_champions || ['', '', '']
      while (champs.length < 3) champs.push('')

      setFormData({
        summoner_name: data.summoner_name || '',
        position: data.position || 'MID',
        tier: data.tier || 'Emerald',
        avatar_url: data.avatar_url || '',
        title: data.title || '새싹 소환사',
        favorite_champions: champs.slice(0, 3),
      })
    }
    setLoading(false)
  }

  const handleChampionChange = (index: number, value: string) => {
    const newChamps = [...formData.favorite_champions]
    newChamps[index] = value
    setFormData({ ...formData, favorite_champions: newChamps })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.summoner_name) {
      return alert('롤 닉네임을 입력해주세요!')
    }

    setSaving(true)

    const payload = {
      id: user.id,
      summoner_name: formData.summoner_name,
      position: formData.position,
      tier: formData.tier,
      avatar_url: formData.avatar_url.trim() || null,
      title: formData.title,
      favorite_champions: formData.favorite_champions.map(c => c.trim()).filter(Boolean),
    }

    const { error } = await supabase.from('players').upsert([payload], { onConflict: 'id' })

    if (error) {
      alert('저장 실패: ' + error.message)
    } else {
      alert('프로필 정보가 성공적으로 적용되었습니다!')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-cyan-400">
        <h2 className="text-lg font-bold animate-pulse">프로필 정보를 불러오는 중...</h2>
      </div>
    )
  }

  if (!user) return null

  const currentAvatar = formData.avatar_url.trim() || user.avatar

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20">
      <PageTitle
        overline="Account Settings"
        title="My Profile & Player Info"
        subtitle="디스코드 계정과 연동된 리그 선수 정보를 관리하고 주력 챔피언을 선택하세요."
      />

      <GlassCard className="p-6 flex items-center gap-4 border-cyan/30 bg-cyan/5">
        <img
          src={currentAvatar}
          alt={user.username}
          className="size-16 rounded-xl border border-cyan/40 object-cover shadow-lg"
        />
        <div>
          <span className="rounded bg-cyan/20 px-2 py-0.5 text-[10px] font-bold text-cyan uppercase">
            Discord Verified
          </span>
          <h2 className="font-display text-xl font-bold mt-1">{user.username}</h2>
          <p className="text-xs text-muted-foreground">ID: {user.id}</p>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="font-display text-base font-bold uppercase tracking-wide text-foreground mb-6 flex items-center gap-2">
          <Trophy className="size-4 text-gold" /> 리그 선수 정보 설정
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase">
                롤 닉네임 (태그 포함)
              </label>
              <input
                type="text"
                placeholder="예: Hideonbush#KR1"
                value={formData.summoner_name}
                onChange={(e) => setFormData({ ...formData, summoner_name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase">
                주 포지션
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-cyan focus:outline-none"
              >
                <option value="TOP">TOP (탑)</option>
                <option value="JG">JG (정글)</option>
                <option value="MID">MID (미드)</option>
                <option value="ADC">ADC (원딜)</option>
                <option value="SUP">SUP (서포터)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase flex items-center gap-1.5">
              <ImageIcon className="size-3.5 text-cyan" /> 커스텀 프로필 아바타 이미지 URL (선택 사항)
            </label>
            <input
              type="text"
              placeholder="https://example.com/my-image.png"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-cyan focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase">
                현재 티어
              </label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-cyan focus:outline-none"
              >
                <option value="Challenger">Challenger</option>
                <option value="Grandmaster">Grandmaster</option>
                <option value="Master">Master</option>
                <option value="Diamond">Diamond</option>
                <option value="Emerald">Emerald</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase flex items-center gap-1.5">
                <Award className="size-3.5 text-gold opacity-50" /> 대표 칭호 (준비 중 / 잠김)
              </label>
              <input
                type="text"
                disabled
                value="새싹 소환사 (임시 잠금)"
                className="w-full rounded-lg border border-border bg-background/50 px-3.5 py-2.5 text-xs text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {/* 🌟 주력 챔피언 3개 드롭다운 선택 섹션 */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase flex items-center gap-1.5">
              <Swords className="size-3.5 text-purple" /> 주력 챔피언 3가지 선택
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((idx) => (
                <select
                  key={idx}
                  value={formData.favorite_champions[idx] || ''}
                  onChange={(e) => handleChampionChange(idx, e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-cyan focus:outline-none"
                >
                  <option value="">-- 챔피언 {idx + 1} 선택 --</option>
                  {POPULAR_CHAMPIONS.map((champ) => (
                    <option key={champ} value={champ}>
                      {champ}
                    </option>
                  ))}
                </select>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              * 목록에서 본인의 주력 챔피언을 최대 3개까지 선택해 주세요.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-cyan px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-background transition-transform hover:-translate-y-0.5 neon-cyan-glow disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving ? '저장 중...' : '프로필 정보 저장'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}