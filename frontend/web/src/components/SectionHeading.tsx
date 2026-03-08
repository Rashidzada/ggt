import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`flex flex-col gap-5 ${actions ? "lg:flex-row lg:items-end lg:justify-between" : ""} ${
        isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
      }`}
    >
      <div className={isCentered ? "mx-auto max-w-3xl" : ""}>
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">{eyebrow}</p>
        <h2 className="brand-title mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">{title}</h2>
        <p className="mt-4 text-base leading-7 text-[var(--muted)] sm:text-lg">{description}</p>
      </div>
      {actions ? <div className={isCentered ? "mx-auto" : "lg:flex-shrink-0"}>{actions}</div> : null}
    </div>
  );
}
