import { cn } from '@/lib/utils'

export function GlassCard({
  className,
  hover = false,
  ...props
}: React.ComponentProps<'div'> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        'glass rounded-xl',
        hover && 'glass-hover',
        className,
      )}
      {...props}
    />
  )
}
