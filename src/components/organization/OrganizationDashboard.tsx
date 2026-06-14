"use client";

import {
  AlertTriangle,
  BellRing,
  Building2,
  Clock3,
  Pill,
  Router,
  UserCheck,
  Users,
} from "lucide-react";
import { Card, SectionTitle, Stat } from "../ui/primitives";
import { useHubs, useStore, useTags } from "@/lib/store";
import { organizationCareEvents } from "@/lib/mock-data";
import { cn, formatTime } from "@/lib/utils";

const SEVERITY = {
  info: "bg-info",
  normal: "bg-mint",
  warning: "bg-warn",
  critical: "bg-danger",
};

export function OrganizationDashboard() {
  const users = useTags("organization");
  const hubs = useHubs("organization");
  const { state } = useStore();
  const events = organizationCareEvents(state.now);
  const onlineHubs = hubs.filter((hub) => hub.status === "online").length;
  const needsReview = events.filter(
    (event) => event.status === "new" || event.status === "checking",
  ).length;
  const medicationPending = events.filter(
    (event) => event.type === "복약 미확인",
  ).length;
  const inactivity = events.filter(
    (event) => event.type === "장시간 무반응",
  ).length;

  return (
    <div className="space-y-5">
      <SectionTitle
        title="BOMI Facility 대시보드"
        desc="여러 이용자의 생활 안전 이벤트를 영상 없이 통합 관리합니다."
        icon={<Building2 className="size-5" />}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <Stat
          label="등록 이용자 수"
          value={users.length}
          icon={<Users className="size-5" />}
          tone="mint"
          sub="데모 이용자"
        />
        <Stat
          label="오늘 확인 필요 이벤트"
          value={`${needsReview}건`}
          icon={<BellRing className="size-5" />}
          tone="danger"
          sub="담당자 확인 대기"
        />
        <Stat
          label="온라인 허브"
          value={`${onlineHubs}/${hubs.length}`}
          icon={<Router className="size-5" />}
          tone="mint"
          sub="구역 감지 운영 중"
        />
        <Stat
          label="복약 미확인"
          value={`${medicationPending}건`}
          icon={<Pill className="size-5" />}
          tone="warn"
          sub="오늘 복약 일정"
        />
        <Stat
          label="장시간 무반응"
          value={`${inactivity}건`}
          icon={<Clock3 className="size-5" />}
          tone="danger"
          sub="기준 시간 초과"
        />
        <Stat
          label="기관 담당자 수"
          value={state.members.length}
          icon={<UserCheck className="size-5" />}
          tone="default"
          sub="권한별 알림 분배"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <p className="mb-1 text-sm font-semibold text-text">
            실시간 이벤트 관제
          </p>
          <p className="mb-4 text-xs text-muted">
            확인이 필요한 이벤트부터 우선 표시합니다.
          </p>
          <div className="space-y-2.5">
            {events.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-xl border border-border-soft bg-surface/35 p-3"
              >
                <span
                  className={cn(
                    "mt-1.5 size-2.5 shrink-0 rounded-full",
                    SEVERITY[event.severity],
                    (event.status === "new" || event.status === "checking") &&
                      "fit-pulse",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-semibold text-text">
                      {event.personName ?? event.location}
                    </p>
                    <span className="text-xs text-pink-soft">{event.type}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {event.description} · {event.location}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted">
                  {formatTime(event.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="mb-4 text-sm font-semibold text-text">
              오늘 이벤트 구성
            </p>
            <div className="space-y-3">
              {[
                { label: "활동·귀가 확인", value: 68, count: "32건", color: "bg-mint" },
                { label: "복약 확인 필요", value: 42, count: "4건", color: "bg-warn" },
                { label: "무반응·확인 요청", value: 28, count: "2건", color: "bg-danger" },
                { label: "허브 상태", value: 14, count: "1건", color: "bg-info" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted">{item.label}</span>
                    <span className="font-medium text-text">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bg-2">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-warn/25 bg-warn/5">
            <p className="flex items-center gap-2 text-sm font-semibold text-text">
              <AlertTriangle className="size-4 text-warn" /> 운영 확인
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              3층 생활실 허브가 오프라인입니다. 담당자에게 네트워크와 전원 확인
              요청이 배정되었습니다.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
