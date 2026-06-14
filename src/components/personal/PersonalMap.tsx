"use client";

import { useState } from "react";
import { Map, Wifi, Crosshair, DoorOpen } from "lucide-react";
import { Card, Button, SectionTitle, Select } from "../ui/primitives";
import { RadarDot } from "../SignalGauge";
import { TagIcon } from "../TagIcon";
import { StatusBadge } from "../StatusBadge";
import { useTags, useZones, useHubs, useStore } from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";
import type { Tag } from "@/lib/types";

export function PersonalMap({ onFind }: { onFind: (t: Tag) => void }) {
  const tags = useTags("personal");
  const zones = useZones("personal");
  const hubs = useHubs("personal");
  const { state } = useStore();
  const [selectedId, setSelectedId] = useState<string>(tags[0]?.id ?? "");

  const selected = tags.find((t) => t.id === selectedId) ?? null;
  const activeZone = zones.find((z) => z.id === selected?.homeZoneId);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="복약·필수 물품 구역 맵"
        desc="BOMI Hub 신호 기반 구역 단위 위치 변화 감지 (정확한 좌표 아님)"
        icon={<Map className="size-5" />}
        action={
          <Select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-48"
          >
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* floor plan */}
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-muted">
            <DoorOpen className="size-4 text-mint" />
            우리 집 구조도 · 1F
            {selected && (
              <span className="ml-auto rounded-full bg-mint/15 px-2.5 py-0.5 font-semibold text-mint">
                {selected.name} → {activeZone?.name ?? selected.lastDetectedZone} 추정
              </span>
            )}
          </div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(2, minmax(108px, 1fr))",
            }}
          >
            {zones.map((z) => {
              const zoneHubs = hubs.filter((h) => h.zoneId === z.id);
              const isActive = activeZone?.id === z.id;
              const zoneTags = tags.filter((t) => t.homeZoneId === z.id);
              return (
                <div
                  key={z.id}
                  className={cn(
                    "relative flex flex-col rounded-xl border p-3 transition",
                    isActive
                      ? "border-mint bg-mint/10 shadow-[0_0_24px_-4px] shadow-mint/40"
                      : "border-border-soft bg-surface/40",
                  )}
                  style={{
                    gridColumn: `${z.col + 1} / span ${z.w}`,
                    gridRow: `${z.row + 1} / span ${z.h}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm font-bold", isActive ? "text-mint" : "text-text")}>
                      {z.name}
                    </span>
                    {zoneHubs.length > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-muted">
                        <Wifi
                          className={cn(
                            "size-3",
                            zoneHubs.some((h) => h.status === "online")
                              ? "text-mint"
                              : "text-danger",
                          )}
                        />
                        {zoneHubs.length}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted">{z.description}</p>

                  {/* item icons */}
                  <div className="mt-auto flex flex-wrap gap-1 pt-2">
                    {zoneTags.slice(0, 5).map((t) => (
                      <span
                        key={t.id}
                        title={t.name}
                        className={cn(
                          "grid size-6 place-items-center rounded-md",
                          t.id === selectedId
                            ? "bg-mint text-[#04221c]"
                            : "bg-surface-2 text-muted",
                        )}
                      >
                        <TagIcon icon={t.icon} className="size-3.5" />
                      </span>
                    ))}
                  </div>

                  {isActive && (
                    <span className="absolute right-2 top-2">
                      <RadarDot active />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[11px] text-muted">
            하이라이트된 구역이 선택한 필수 물품이 가장 강하게 감지되는 영역입니다.
          </p>
        </Card>

        {/* selected detail */}
        <Card className="space-y-4">
          {selected ? (
            <>
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-surface-2 text-pink-soft">
                  <TagIcon icon={selected.icon} className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-bold text-text">{selected.name}</p>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <Row label="추정 구역" value={activeZone?.name ?? selected.lastDetectedZone} />
                <Row label="감지 허브" value={selected.lastDetectedHub} />
                <Row label="신호 강도" value={`${selected.signalStrength} / 100`} />
                <Row label="마지막 감지" value={timeAgo(selected.lastDetectedAt, state.now)} />
              </div>
              <Button variant="primary" className="w-full" onClick={() => onFind(selected)}>
                <Crosshair className="size-4" /> 위치 확인
              </Button>
              <p className="text-[11px] text-muted">
                구역 단위 추정입니다. 해당 구역 내에서 허브 근처를 천천히 살펴보세요.
              </p>
            </>
          ) : (
            <p className="py-8 text-center text-sm text-muted">필수 물품을 선택하세요.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border-soft bg-surface/40 px-3 py-2">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-medium text-text">{value}</span>
    </div>
  );
}
