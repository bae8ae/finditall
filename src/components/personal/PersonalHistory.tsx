"use client";

import { Bell, History, CheckCheck } from "lucide-react";
import { Card, SectionTitle, Button } from "../ui/primitives";
import { DetectionTimeline } from "../DetectionTimeline";
import { useNotifications, useLogs, useStore } from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";

const KIND_STYLE: Record<string, string> = {
  info: "border-info/30 bg-info/5 text-info",
  ok: "border-mint/30 bg-mint/5 text-mint",
  warn: "border-warn/30 bg-warn/5 text-warn",
  danger: "border-danger/30 bg-danger/5 text-danger",
};

export function PersonalHistory() {
  const notifications = useNotifications("personal");
  const logs = useLogs("personal");
  const { markRead, state } = useStore();

  return (
    <div className="space-y-4">
      <SectionTitle
        title="알림 및 히스토리"
        desc="물건 감지 활동과 알림 기록"
        icon={<Bell className="size-5" />}
        action={
          <Button variant="ghost" size="sm" onClick={() => markRead("personal")}>
            <CheckCheck className="size-4" /> 모두 읽음
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-3 text-sm font-semibold text-text">알림</p>
          <div className="space-y-2.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "rounded-xl border p-3",
                  KIND_STYLE[n.kind],
                  !n.read && "ring-1 ring-inset ring-white/5",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-text">{n.title}</p>
                  {!n.read && (
                    <span className="size-2 shrink-0 rounded-full bg-pink" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted">{n.body}</p>
                <p className="mt-1 text-[11px] text-muted/70">
                  {timeAgo(n.timestamp, state.now)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
            <History className="size-4 text-mint" /> 감지 히스토리
          </p>
          <DetectionTimeline logs={logs.slice(0, 8)} now={state.now} />
        </Card>
      </div>
    </div>
  );
}
