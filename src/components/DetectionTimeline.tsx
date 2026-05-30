"use client";

import { Radio } from "lucide-react";
import type { DetectionLog } from "@/lib/types";
import { formatTime, timeAgo } from "@/lib/utils";
import { SignalBar } from "./SignalGauge";

export function DetectionTimeline({
  logs,
  now,
  empty = "감지 로그가 없습니다.",
}: {
  logs: DetectionLog[];
  now: number;
  empty?: string;
}) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted">
        {empty}
      </div>
    );
  }
  return (
    <ol className="relative space-y-4 pl-6">
      <span className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
      {logs.map((l) => (
        <li key={l.id} className="relative">
          <span className="absolute -left-[22px] top-1 grid size-4 place-items-center rounded-full border border-mint/50 bg-bg">
            <Radio className="size-2 text-mint" />
          </span>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="text-sm font-medium text-text">
              {l.hubName}
              <span className="ml-2 text-xs font-normal text-muted">
                {l.zone}
              </span>
            </p>
            <span className="text-[11px] text-muted">
              {timeAgo(l.timestamp, now)} · {formatTime(l.timestamp)}
            </span>
          </div>
          <div className="mt-1.5 max-w-[220px]">
            <SignalBar value={l.signalStrength} showLabel={false} />
          </div>
        </li>
      ))}
    </ol>
  );
}
