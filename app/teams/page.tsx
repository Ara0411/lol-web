// app/teams/page.tsx
import React from 'react';

interface TeamMember {
  name: string;
  position: 'TOP' | 'JG' | 'MID' | 'ADC' | 'SUP';
  isSubstitute?: boolean;
  avatarUrl: string;
  tier: string;
}

interface TeamData {
  id: string;
  name: string;
  logoUrl: string;
  points: number;
  members: TeamMember[];
}

const POSITION_ORDER = ['TOP', 'JG', 'MID', 'ADC', 'SUP'];

export default function TeamsPage() {
  // 🚀 임시 테스트용 팀 데이터 (여기서 수정해서 테스트 가능)
  const team: TeamData = {
    id: 'team-1',
    name: '롤이터 기습공격단',
    logoUrl: '/placeholder-logo.png',
    points: 15400,
    members: [
      { name: '탑킹왕짱', position: 'TOP', isSubstitute: false, tier: 'Grandmaster', avatarUrl: '/placeholder-user.jpg' },
      { name: '정글의법칙', position: 'JG', isSubstitute: false, tier: 'Master', avatarUrl: '/placeholder-user.jpg' },
      { name: '페이커제자', position: 'MID', isSubstitute: false, tier: 'Challenger', avatarUrl: '/placeholder-user.jpg' },
      { name: '원딜은나야', position: 'ADC', isSubstitute: false, tier: 'Diamond', avatarUrl: '/placeholder-user.jpg' },
      { name: '든든서폿', position: 'SUP', isSubstitute: false, tier: 'Emerald', avatarUrl: '/placeholder-user.jpg' },
      // 하단 후보 선수 2명
      { name: '식스맨후보1', position: 'MID', isSubstitute: true, tier: 'Emerald', avatarUrl: '/placeholder-user.jpg' },
      { name: '식스맨후보2', position: 'ADC', isSubstitute: true, tier: 'Platinum', avatarUrl: '/placeholder-user.jpg' },
    ]
  };

  const membersList = team.members || [];

  // 주전 멤버 필터링 및 지정된 순서대로 정렬
  const mainMembers = POSITION_ORDER.map(
    pos => membersList.find(m => m.position === pos && !m.isSubstitute)
  ).filter(Boolean) as TeamMember[];

  // 하단 후보 멤버 2명 필터링
  const substitutes = membersList.filter(m => m.isSubstitute).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-xl my-10">
      {/* 팀 헤더 (팀명, 로고, 포인트) */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={team.logoUrl}
            alt={team.name}
            className="h-16 w-16 rounded-xl border border-white/20 object-cover bg-white/5"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-white">{team.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">롤이터 공식 프로 팀</p>
          </div>
        </div>
        <div className="text-right bg-neon-cyan/10 border border-neon-cyan/30 px-4 py-2 rounded-xl">
          <div className="text-xs text-cyan-300">보유 팀 포인트</div>
          <div className="text-xl font-bold text-white">{team.points.toLocaleString()} P</div>
        </div>
      </div>

      {/* 주전 로스터 (라인별 정렬: TOP -> JG -> MID -> ADC -> SUP) */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 tracking-wider uppercase">주전 로스터 (TOP ➔ SUP)</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {POSITION_ORDER.map(pos => {
            const member = mainMembers.find(m => m.position === pos);
            return (
              <div key={pos} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center flex flex-col items-center">
                <span className="text-xs font-bold text-neon-cyan bg-cyan-950/50 px-2 py-0.5 rounded mb-2 border border-cyan-800/50">
                  {pos}
                </span>
                {member ? (
                  <>
                    <img src={member.avatarUrl} alt={member.name} className="h-12 w-12 rounded-full mb-2 object-cover" />
                    <div className="font-bold text-white text-sm truncate w-full">{member.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{member.tier}</div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500 py-4">공석</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 후보 선수 영역 (하단 2명 배치) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 tracking-wider uppercase">식스맨 / 후보 로스터 (하단 2명)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {substitutes.length > 0 ? (
            substitutes.map((sub, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <img src={sub.avatarUrl} alt={sub.name} className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{sub.name}</span>
                    <span className="text-xs text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">후보 ({sub.position})</span>
                  </div>
                  <div className="text-xs text-gray-400">{sub.tier}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-4 bg-white/5 rounded-xl text-xs text-gray-500 border border-white/5">
              등록된 후보 선수가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}