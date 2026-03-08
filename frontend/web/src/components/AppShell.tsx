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
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {children ?? <Outlet />}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
