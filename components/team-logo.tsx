import { TEAMS } from '@/lib/data'
import { cn } from '@/lib/utils'

function initials(name: string) {
  const t = TEAMS.find((x) => x.name === name)
  if (t) return t.short
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function colorFor(name: string) {
  return TEAMS.find((x) => x.name === name)?.color ?? '#22d3ee'
}

export function TeamLogo({
  name,
  size = 40,
  className,
}: {
  name: string
  size?: number
  className?: string
}) {
  const color = colorFor(name)
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-display font-bold',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        color,
        background: `linear-gradient(150deg, ${color}22, transparent 70%)`,
        border: `1px solid ${color}55`,
        boxShadow: `0 0 16px -6px ${color}aa`,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}
