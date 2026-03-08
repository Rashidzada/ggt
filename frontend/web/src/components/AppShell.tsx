import { type ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "./Footer";
import { Navigation } from "./Navigation";
import { WhatsAppFloat } from "./WhatsAppFloat";

interface AppShellProps {
  children?: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen">
      <Navigation />
      <main className="relative mx-auto w-full max-w-7xl px-3 pb-16 pt-5 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8 lg:pb-24 lg:pt-10">
        {children ?? <Outlet />}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
