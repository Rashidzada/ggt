import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="glass-panel rounded-[36px] px-6 py-16 text-center sm:px-10">
      <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">404</p>
      <h1 className="brand-title mt-4 text-5xl text-slate-950">Page not found</h1>
      <p className="mt-5 text-lg text-[var(--muted)]">
        The page you requested does not exist or has been moved.
      </p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white">
        Return home
      </Link>
    </div>
  );
}
