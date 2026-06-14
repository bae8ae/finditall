"use client";

import { useState, useSyncExternalStore } from "react";
import { Header, type Mode, Logo } from "./Header";
import { LandingHero } from "./LandingHero";
import { PersonalApp } from "./personal/PersonalApp";
import { OrganizationApp } from "./organization/OrganizationApp";

const noopSubscribe = () => () => {};

export function AppShell() {
  const [mode, setMode] = useState<Mode>("landing");
  // true only after client hydration — avoids SSR/localStorage mismatches
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <div className="fit-pulse">
          <Logo />
        </div>
        <p className="text-sm text-muted">BOMI가 조용히 연결되는 중…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header mode={mode} setMode={setMode} />
      <main className="flex-1">
        {mode === "landing" && <LandingHero setMode={setMode} />}
        {mode === "personal" && <PersonalApp />}
        {mode === "organization" && <OrganizationApp />}
      </main>
    </div>
  );
}
