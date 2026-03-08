interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">{eyebrow}</p>
      <h2 className="brand-title mt-3 text-4xl leading-tight text-slate-950">{title}</h2>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">{description}</p>
    </div>
  );
}
