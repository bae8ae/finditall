"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BellRing,
  Building2,
  MapPinned,
  Router,
  Users,
} from "lucide-react";
import { Card, SectionTitle } from "../ui/primitives";
import { useHubs, useStore, useTags, useZones } from "@/lib/store";
import { organizationCareEvents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function OrganizationMap() {
  const users = useTags("organization");
  const zones = useZones("organization");
  const hubs = useHubs("organization");
  const { state } = useStore();
  const events = organizationCareEvents(state.now);
  const floors = [...new Set(zones.map((zone) => zone.floor))];
  const [floor, setFloor] = useState("all");
  const visibleZones =
    floor === "all" ? zones : zones.filter((zone) => zone.floor === floor);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="구역 맵"
        desc="구역별 이용자, BOMI Hub, 확인 필요 이벤트를 함께 봅니다."
        icon={<MapPinned className="size-5" />}
      />

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit p-3">
          <p className="mb-2 px-1 text-xs font-semibold text-muted">층 / 구역</p>
          <button
            onClick={() => setFloor("all")}
            className={cn(
              "mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
              floor === "all" ? "bg-mint/12 text-mint" : "text-muted hover:text-text",
            )}
          >
            <Building2 className="size-4" /> 전체 층
          </button>
          {floors.map((item) => {
            const floorZones = zones.filter((zone) => zone.floor === item);
            const userCount = users.filter((user) =>
              floorZones.some((zone) => zone.id === user.homeZoneId),
            ).length;
            return (
              <button
                key={item}
                onClick={() => setFloor(item)}
                className={cn(
                  "mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                  floor === item ? "bg-mint/12 text-mint" : "text-muted hover:text-text",
                )}
              >
                <span>{item}</span>
                <span className="text-[11px] text-muted">{userCount}명</span>
              </button>
            );
          })}
        </Card>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleZones.map((zone) => {
            const zoneHubs = hubs.filter((hub) => hub.zoneId === zone.id);
            const zoneUsers = users.filter((user) => user.homeZoneId === zone.id);
            const zoneEvents = events.filter((event) => event.location === zone.name);
            const urgentCount = zoneEvents.filter(
              (event) =>
                event.severity === "warning" || event.severity === "critical",
            ).length;

            return (
              <Card
                key={zone.id}
                className={cn(
                  "space-y-4 transition",
                  urgentCount > 0 && "border-warn/35 bg-warn/5",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-text">{zone.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {zone.floor} · {zone.description}
                    </p>
                  </div>
                  {urgentCount > 0 && (
                    <span className="fit-pulse size-2.5 rounded-full bg-warn" />
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <Mini
                    icon={<Users className="size-3.5" />}
                    label="이용자"
                    value={zoneUsers.length}
                  />
                  <Mini
                    icon={<Router className="size-3.5" />}
                    label="허브"
                    value={zoneHubs.length}
                  />
                  <Mini
                    icon={<BellRing className="size-3.5" />}
                    label="이벤트"
                    value={zoneEvents.length}
                    danger={urgentCount > 0}
                  />
                </div>

                <div className="space-y-2">
                  {zoneUsers.slice(0, 4).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-lg border border-border-soft bg-surface/40 px-3 py-2"
                    >
                      <span className="text-xs text-text">{user.name}</span>
                      <span className="text-[10px] text-muted">{user.assignee}</span>
                    </div>
                  ))}
                  {zoneUsers.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border-soft py-4 text-center text-xs text-muted">
                      등록 이용자 없음
                    </p>
                  )}
                </div>

                {urgentCount > 0 && (
                  <div className="flex items-start gap-2 rounded-xl border border-warn/25 bg-warn/8 p-3 text-xs text-muted">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warn" />
                    {urgentCount}건의 확인 필요 이벤트가 있습니다.
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Mini({
  icon,
  label,
  value,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border-soft bg-surface/40 py-2">
      <span className={cn("mx-auto mb-1 flex justify-center", danger ? "text-warn" : "text-mint")}>
        {icon}
      </span>
      <p className={cn("text-sm font-bold", danger ? "text-warn" : "text-text")}>
        {value}
      </p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}
