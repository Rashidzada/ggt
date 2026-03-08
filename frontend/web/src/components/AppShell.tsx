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
      <main className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-24">
        {children ?? <Outlet />}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
