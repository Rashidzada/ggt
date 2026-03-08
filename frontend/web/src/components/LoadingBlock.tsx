export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="glass-panel flex min-h-[240px] items-center justify-center rounded-[32px] p-10">
      <div className="flex items-center gap-3 text-lg font-semibold text-[var(--brand-deep)]">
        <span className="size-3 animate-pulse rounded-full bg-[var(--brand)]" />
        {label}
      </div>
    </div>
  );
}
