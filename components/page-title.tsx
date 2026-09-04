export function PageTitle({
  overline,
  title,
  subtitle,
}: {
  overline: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-8">
      <p className="mb-1 font-mono text-xs uppercase tracking-[0.3em] text-cyan/80">
        {overline}
      </p>
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
