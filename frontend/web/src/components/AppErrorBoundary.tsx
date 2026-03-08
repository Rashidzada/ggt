import { Component, type ErrorInfo, type ReactNode } from "react";

import { BrandMark } from "./BrandMark";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React app crashed", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12 sm:px-6">
        <section className="glass-panel w-full rounded-[36px] p-8 sm:p-10">
          <BrandMark
            logoClassName="size-16 rounded-[24px]"
            titleClassName="brand-title text-3xl text-[var(--brand-deep)]"
          />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Frontend recovery</p>
          <h1 className="brand-title mt-4 text-4xl leading-tight text-slate-950">The page hit a runtime error.</h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            The app did not load correctly in this browser session. Reload the page to retry with a clean state.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white"
            >
              Reload app
            </button>
            <a
              href="/"
              className="rounded-full border border-[var(--line)] bg-white px-6 py-3 font-semibold text-[var(--copy)]"
            >
              Go to homepage
            </a>
          </div>
          {import.meta.env.DEV ? (
            <details className="mt-8 rounded-[24px] border border-[var(--line)] bg-white/80 p-5 text-sm text-[var(--muted)]">
              <summary className="cursor-pointer font-semibold text-slate-900">Developer error details</summary>
              <pre className="mt-4 whitespace-pre-wrap break-words">{this.state.error.stack ?? this.state.error.message}</pre>
            </details>
          ) : null}
        </section>
      </main>
    );
  }
}
