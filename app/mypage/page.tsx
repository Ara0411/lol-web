// app/mypage/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Save, Award, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PageTitle } from '@/components/page-title'
import { GlassCard } from '@/components/ui/glass-card'

interface DiscordUser {
  id: string
  username: string
  avatar: string
}

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 폼 입력 상태 (커스텀 아바타 URL 필드 추가)
  const [formData, setFormData] = useState({
    summoner_name: '',
    position: 'MID',
    tier: 'Emerald',
    avatar_url: '', // 👈 커스텀 프로필 사진 URL
    title: '새싹 소환사',
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
      setFormData({
        summoner_name: data.summoner_name || '',
        position: data.position || 'MID',
        tier: data.tier || 'Emerald',
        avatar_url: data.avatar_url || '', // DB에 저장된 커스텀 아바타
        title: data.title || '새싹 소환사',
      })
    }
    setLoading(false)
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
      avatar_url: formData.avatar_url.trim() || null, // 빈값이면 null로 처리하여 디스코드 기본값 유도 가능
      title: formData.title,
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

  // 실제 화면에 보여줄 아바타 (커스텀 URL이 있으면 그건 쓰고, 없으면 디스코드 기본 아바타 사용)
  const currentAvatar = formData.avatar_url.trim() || user.avatar

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20">
      <PageTitle
        overline="Account Settings"
        title="My Profile & Player Info"
        subtitle="디스코드 계정과 연동된 롤이터 리그 선수 정보를 관리하고 프로필 사진을 커스텀하세요."
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

          {/* 커스텀 프로필 사진 URL 입력 필드 */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase flex items-center gap-1.5">
              <ImageIcon className="size-3.5 text-cyan" /> 커스텀 프로필 아바타 이미지 URL (선택 사항)
            </label>
            <input
              type="text"
              placeholder="https://example.com/my-image.png (비워두면 디스코드 프로필 기본 사용)"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-cyan focus:outline-none"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              * 별도의 커스텀 이미지를 원하지 않으면 빈 칸으로 두세요. 디스코드 프로필 사진이 기본으로 반영됩니다.
            </p>
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

            {/* 🔒 칭호 기능 임시 잠금 처리된 UI 부분 */}
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
              <p className="text-[10px] text-amber-400/80 mt-1">
                * 칭호 및 커스텀 타이틀 시스템은 현재 업데이트 준비 중으로 일시 잠금 처리되었습니다.
              </p>
            </div>
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