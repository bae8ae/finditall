"use client";

import { cn } from "@/lib/utils";
import type { TagStatus, HubStatus } from "@/lib/types";

const TAG_MAP: Record<TagStatus, { label: string; cls: string; dot: string }> = {
  normal: { label: "정상", cls: "bg-mint/12 text-mint border-mint/30", dot: "bg-mint" },
  searching: { label: "탐색 중", cls: "bg-info/12 text-info border-info/30", dot: "bg-info" },
  missing: { label: "미감지", cls: "bg-danger/12 text-danger border-danger/30", dot: "bg-danger" },
  lowSignal: { label: "신호 약함", cls: "bg-warn/12 text-warn border-warn/30", dot: "bg-warn" },
  archived: { label: "보관됨", cls: "bg-surface-2 text-muted border-border", dot: "bg-muted" },
};

const HUB_MAP: Record<HubStatus, { label: string; cls: string; dot: string }> = {
  online: { label: "온라인", cls: "bg-mint/12 text-mint border-mint/30", dot: "bg-mint" },
  offline: { label: "오프라인", cls: "bg-danger/12 text-danger border-danger/30", dot: "bg-danger" },
  warning: { label: "주의", cls: "bg-warn/12 text-warn border-warn/30", dot: "bg-warn" },
};

export function StatusBadge({
  status,
  type = "tag",
  className,
}: {
  status: TagStatus | HubStatus;
  type?: "tag" | "hub";
  className?: string;
}) {
  const m =
    type === "hub"
      ? HUB_MAP[status as HubStatus]
      : TAG_MAP[status as TagStatus];
  if (!m) return null;
  const live = status === "searching" || status === "warning";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        m.cls,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", m.dot, live && "fit-pulse")} />
      {m.label}
    </span>
  );
}

const IMP_MAP = {
  high: { label: "높음", cls: "bg-danger/12 text-danger border-danger/30" },
  normal: { label: "보통", cls: "bg-info/12 text-info border-info/30" },
  low: { label: "낮음", cls: "bg-surface-2 text-muted border-border" },
};

export function ImportanceBadge({ level }: { level?: "low" | "normal" | "high" }) {
  if (!level) return null;
  const m = IMP_MAP[level];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
        m.cls,
      )}
    >
      {m.label}
    </span>
  );
}

const ROLE_MAP: Record<string, string> = {
  admin: "bg-pink/12 text-pink-soft border-pink/30",
  manager: "bg-mint/12 text-mint border-mint/30",
  staff: "bg-info/12 text-info border-info/30",
  viewer: "bg-surface-2 text-muted border-border",
  personal: "bg-mint/12 text-mint border-mint/30",
};
const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
  staff: "Staff",
  viewer: "Viewer",
  personal: "Personal",
};

export function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold",
        ROLE_MAP[role] ?? ROLE_MAP.viewer,
      )}
    >
      {ROLE_LABEL[role] ?? role}
    </span>
  );
}
