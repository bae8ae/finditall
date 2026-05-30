import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO/Date string as a relative "x분 전" label (deterministic vs given now). */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  if (diff < 0) return "방금 전";
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Lightweight non-crypto id; fine for mock data. */
export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function signalLabel(s: number): { label: string; tone: string } {
  if (s >= 80) return { label: "매우 강함", tone: "text-mint" };
  if (s >= 60) return { label: "강함", tone: "text-mint-soft" };
  if (s >= 40) return { label: "보통", tone: "text-warn" };
  if (s >= 20) return { label: "약함", tone: "text-danger" };
  return { label: "미감지", tone: "text-muted" };
}
