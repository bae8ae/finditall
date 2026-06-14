"use client";

import { Bell, BellRing, CheckCheck, MapPin, ShieldCheck } from "lucide-react";
import { Button, Card, SectionTitle } from "../ui/primitives";
import { personalCareEvents } from "@/lib/mock-data";
import { useNotifications, useStore } from "@/lib/store";
import { cn, formatTime, timeAgo } from "@/lib/utils";

const SEVERITY = {
  info: "border-info/25 bg-info/5 text-info",
  normal: "border-mint/25 bg-mint/5 text-mint",
  warning: "border-warn/30 bg-warn/5 text-warn",
  critical: "border-danger/30 bg-danger/5 text-danger",
};

const STATUS = {
  new: "확인 필요",
  checking: "확인 중",
  confirmed: "확인됨",
  resolved: "조치 완료",
};

export function PersonalHistory() {
  const notifications = useNotifications("personal");
  const { markRead, state } = useStore();
  const events = personalCareEvents(state.now);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="생활 안전 이벤트"
        desc="활동, 무반응, 복약, 외출·귀가와 보호자 확인 기록"
        icon={<Bell className="size-5" />}
        action={
          <Button variant="ghost" size="sm" onClick={() => markRead("personal")}>
            <CheckCheck className="size-4" /> 알림 모두 읽음
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card className="p-0">
          <div className="grid grid-cols-[72px_1fr] border-b border-border-soft px-4 py-3 text-xs text-muted sm:grid-cols-[84px_1.2fr_1fr_90px_100px]">
            <span>시간</span>
            <span>이벤트</span>
            <span className="hidden sm:block">위치/설명</span>
            <span className="hidden sm:block">알림</span>
            <span className="hidden sm:block">상태</span>
          </div>
          <div>
            {events.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-[72px_1fr] items-start gap-3 border-b border-border-soft/60 px-4 py-3 last:border-0 sm:grid-cols-[84px_1.2fr_1fr_90px_100px]"
              >
                <div>
                  <p className="text-sm font-semibold text-text">
                    {formatTime(event.timestamp)}
                  </p>
                  <p className="text-[10px] text-muted">
                    {timeAgo(event.timestamp, state.now)}
                  </p>
                </div>
                <div>
                  <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold", SEVERITY[event.severity])}>
                    {event.type}
                  </span>
                  <p className="mt-1 text-xs text-muted sm:hidden">
                    {event.location} · {event.description}
                  </p>
                  <p className="mt-1 text-[10px] text-muted sm:hidden">
                    {event.guardianNotified ? "보호자 알림 전송" : "알림 없음"} · {STATUS[event.status]}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <p className="flex items-center gap-1 text-xs font-medium text-text">
                    <MapPin className="size-3 text-mint" /> {event.location}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    {event.description}
                  </p>
                </div>
                <span className="hidden text-xs text-muted sm:block">
                  {event.guardianNotified ? "전송됨" : "없음"}
                </span>
                <span className="hidden text-xs font-medium text-text sm:block">
                  {STATUS[event.status]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="h-fit">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
            <BellRing className="size-4 text-pink-soft" /> 보호자 알림
          </p>
          <div className="space-y-2.5">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "rounded-xl border border-border-soft bg-surface/35 p-3",
                  !notification.read && "ring-1 ring-inset ring-pink/20",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-text">
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="size-2 rounded-full bg-pink" />
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {notification.body}
                </p>
                <p className="mt-1 text-[10px] text-muted/70">
                  {timeAgo(notification.timestamp, state.now)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-mint/20 bg-mint/5 p-3 text-[11px] leading-relaxed text-muted">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-mint" />
            raw 생활 신호가 아니라 보호자가 이해할 수 있는 이벤트로 변환해
            전달합니다.
          </div>
        </Card>
      </div>
    </div>
  );
}
