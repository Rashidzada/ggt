interface BrandMarkProps {
  logoClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  showSubtitle?: boolean;
}

export function BrandMark({
  logoClassName = "size-12 rounded-2xl",
  titleClassName = "brand-title text-xl leading-none text-[var(--brand-deep)]",
  subtitleClassName = "text-xs uppercase tracking-[0.28em] text-[var(--muted)]",
  showSubtitle = true,
}: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/gogreentech-logo.png"
        alt="GoGreenTech logo"
        className={`${logoClassName} object-cover shadow-lg shadow-emerald-900/10`}
      />
      <div>
        <p className={titleClassName}>GoGreenTech</p>
        {showSubtitle ? <p className={subtitleClassName}>Learning Academy</p> : null}
      </div>
    </div>
  );
}
