import { cn } from '@/lib/utils'

const TONES = {
  cyan: 'border-cyan/40 bg-cyan/10 text-cyan',
  purple: 'border-purple/40 bg-purple/10 text-purple',
  gold: 'border-gold/40 bg-gold/10 text-gold',
  success: 'border-success/40 bg-success/10 text-success',
  danger: 'border-danger/40 bg-danger/10 text-danger',
  muted: 'border-border bg-white/5 text-muted-foreground',
} as const

export function NeonBadge({
  tone = 'cyan',
  className,
  children,
  ...props
}: React.ComponentProps<'span'> & { tone?: keyof typeof TONES }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        TONES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
