"use client";

import { useState } from "react";
import { Radar, Bell, Home, Building2, Sparkles } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { useNotifications, useStore } from "@/lib/store";
import type { OwnerType } from "@/lib/types";

export type Mode = "landing" | "personal" | "organization";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2.5"
      aria-label="FindIt All 홈"
    >
      <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-pink to-mint shadow-lg shadow-pink/20">
        <Radar className="size-5 text-white" />
        <span className="absolute inset-0 rounded-xl border border-white/20" />
      </span>
      <span className="text-lg font-extrabold tracking-tight">
        <span className="text-text">FindIt</span>{" "}
        <span className="gradient-text">All</span>
      </span>
    </button>
  );
}

function NotificationBell({ ownerType }: { ownerType: OwnerType }) {
  const [open, setOpen] = useState(false);
  const notifications = useNotifications(ownerType);
  const { markRead, state } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  const dotTone: Record<string, string> = {
    info: "bg-info",
    ok: "bg-mint",
    warn: "bg-warn",
    danger: "bg-danger",
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open && unread) setTimeout(() => markRead(ownerType), 1200);
        }}
        className="relative grid size-9 place-items-center rounded-xl border border-border bg-surface/60 text-muted transition hover:text-text"
        aria-label="알림"
      >
        <Bell className="size-[18px]" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-pink px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="fit-pop absolute right-0 z-40 mt-2 w-[min(88vw,360px)] overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
              <p className="text-sm font-semibold text-text">알림</p>
              <span className="text-[11px] text-muted">최근 활동</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-muted">
                  알림이 없습니다.
                </p>
              )}
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-3 border-b border-border-soft/60 px-4 py-3 last:border-0"
                >
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      dotTone[n.kind],
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{n.body}</p>
                    <p className="mt-1 text-[11px] text-muted/70">
                      {timeAgo(n.timestamp, state.now)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Header({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  const tabs: { key: Mode; label: string; icon: typeof Home }[] = [
    { key: "personal", label: "개인 사용자", icon: Home },
    { key: "organization", label: "기관 사용자", icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Logo onClick={() => setMode("landing")} />
          <div className="hidden items-center gap-1 rounded-xl border border-border-soft bg-surface/50 p-1 md:flex">
            {tabs.map((t) => {
              const active = mode === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setMode(t.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition",
                    active
                      ? "bg-gradient-to-br from-pink/20 to-mint/15 text-text shadow-sm"
                      : "text-muted hover:text-text",
                  )}
                >
                  <t.icon className="size-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === "landing" ? (
            <button
              onClick={() => setMode("personal")}
              className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-br from-pink to-pink-soft px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink/20 transition hover:brightness-110 sm:flex"
            >
              <Sparkles className="size-4" />앱 둘러보기
            </button>
          ) : (
            <NotificationBell ownerType={mode} />
          )}
        </div>
      </div>

      {/* mobile mode tabs */}
      {mode !== "landing" && (
        <div className="flex gap-1 border-t border-border-soft px-4 py-2 md:hidden">
          {tabs.map((t) => {
            const active = mode === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setMode(t.key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-sm font-medium transition",
                  active
                    ? "bg-surface-2 text-text"
                    : "text-muted",
                )}
              >
                <t.icon className="size-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
