import { Menu, UserCircle2, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import { BrandMark } from "./BrandMark";
import { useAuth } from "../hooks/useAuth";

function navLinkClass(isActive: boolean) {
  return isActive
    ? "rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
    : "rounded-full px-4 py-2 text-sm font-semibold text-[var(--copy)] transition hover:bg-white/70";
}

function mobileNavLinkClass(isActive: boolean) {
  return isActive
    ? "rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white"
    : "rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--copy)] transition hover:bg-white/70";
}

export function Navigation() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    ...(user ? [{ to: "/free-learning", label: "Free Learning" }] : []),
    { to: "/courses", label: "Courses" },
    { to: "/apply", label: "Apply" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <NavLink
            to="/"
            className="min-w-0"
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
          >
            <BrandMark
              logoClassName="size-10 rounded-xl sm:size-12 sm:rounded-2xl"
              titleClassName="brand-title text-lg leading-none text-[var(--brand-deep)] sm:text-xl"
              subtitleClassName="text-[10px] uppercase tracking-[0.24em] text-[var(--muted)] sm:text-xs sm:tracking-[0.28em]"
            />
          </NavLink>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-white text-[var(--copy)] md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:gap-6">
            <nav className="flex flex-1 items-center justify-center gap-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => navLinkClass(isActive)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "inline-flex items-center gap-2 rounded-full border border-[var(--brand)] bg-[var(--highlight)] px-4 py-2 font-semibold text-[var(--brand-deep)]"
                        : "inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 font-semibold text-[var(--copy)]"
                    }
                  >
                    <UserCircle2 className="size-4" />
                    {user.role === "admin" ? "Admin" : "Dashboard"}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="rounded-full border border-[var(--line)] px-4 py-2 font-semibold text-[var(--copy)]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? "rounded-full border border-[var(--brand)] bg-[var(--highlight)] px-4 py-2 font-semibold text-[var(--brand-deep)]"
                        : "rounded-full border border-[var(--line)] bg-white px-4 py-2 font-semibold text-[var(--copy)]"
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink to="/register" className="rounded-full bg-[var(--brand)] px-4 py-2 font-semibold text-white">
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-4 space-y-3 md:hidden">
            <nav className="glass-panel rounded-[28px] p-3">
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className={({ isActive }) => mobileNavLinkClass(isActive)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            <div className="grid gap-2">
              {user ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      isActive
                        ? "inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--brand)] bg-[var(--highlight)] px-4 py-3 font-semibold text-[var(--brand-deep)]"
                        : "inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 font-semibold text-[var(--copy)]"
                    }
                  >
                    <UserCircle2 className="size-4" />
                    {user.role === "admin" ? "Admin dashboard" : "Dashboard"}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      void logout();
                    }}
                    className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 font-semibold text-[var(--copy)]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      isActive
                        ? "rounded-2xl border border-[var(--brand)] bg-[var(--highlight)] px-4 py-3 text-center font-semibold text-[var(--brand-deep)]"
                        : "rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-center font-semibold text-[var(--copy)]"
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-center font-semibold text-white"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
