"use client";

import { useState } from "react";
import { MapPinned, Wifi, Boxes, AlertTriangle, Crosshair, Building2 } from "lucide-react";
import { Card, Button, SectionTitle, Select } from "../ui/primitives";
import { TagIcon } from "../TagIcon";
import { StatusBadge } from "../StatusBadge";
import { RadarDot } from "../SignalGauge";
import { useTags, useZones, useHubs } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Tag } from "@/lib/types";

export function OrganizationMap({ onSearch }: { onSearch: (t: Tag) => void }) {
  const tags = useTags("organization");
  const zones = useZones("organization");
  const hubs = useHubs("organization");

  const floors = [...new Set(zones.map((z) => z.floor))];
  const [floor, setFloor] = useState("all");
  const [selectedTagId, setSelectedTagId] = useState<string>("");

  const selectedTag = tags.find((t) => t.id === selectedTagId) ?? null;
  const visibleZones =
    floor === "all" ? zones : zones.filter((z) => z.floor === floor);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="실내 자산 맵"
        desc="층·구역별 자산 분포 · 자산 선택 시 감지 구역 하이라이트"
        icon={<MapPinned className="size-5" />}
        action={
          <Select
            value={selectedTagId}
            onChange={(e) => setSelectedTagId(e.target.value)}
            className="w-52"
          >
            <option value="">자산 선택…</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        {/* floor / zone list */}
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
          {floors.map((f) => {
            const fz = zones.filter((z) => z.floor === f);
            const assetCount = tags.filter((t) =>
              fz.some((z) => z.id === t.homeZoneId),
            ).length;
            return (
              <button
                key={f}
                onClick={() => setFloor(f)}
                className={cn(
                  "mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                  floor === f ? "bg-mint/12 text-mint" : "text-muted hover:text-text",
                )}
              >
                <span>{f}</span>
                <span className="text-[11px] text-muted">{assetCount}개</span>
              </button>
            );
          })}
        </Card>

        {/* zone cards */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleZones.map((z) => {
            const zoneHubs = hubs.filter((h) => h.zoneId === z.id);
            const zoneTags = tags.filter((t) => t.homeZoneId === z.id);
            const missingCount = zoneTags.filter(
              (t) => t.status === "missing" || t.status === "lowSignal",
            ).length;
            const isActive = selectedTag?.homeZoneId === z.id;
            return (
              <Card
                key={z.id}
                className={cn(
                  "space-y-3 transition",
                  isActive && "border-mint bg-mint/10 shadow-[0_0_24px_-6px] shadow-mint/40",
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={cn("text-sm font-bold", isActive ? "text-mint" : "text-text")}>
                      {z.name}
                    </p>
                    <p className="text-[11px] text-muted">{z.floor} · {z.description}</p>
                  </div>
                  {isActive && <RadarDot active />}
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <Mini icon={<Wifi className="size-3.5" />} label="허브" value={zoneHubs.length} />
                  <Mini icon={<Boxes className="size-3.5" />} label="자산" value={zoneTags.length} />
                  <Mini
                    icon={<AlertTriangle className="size-3.5" />}
                    label="의심"
                    value={missingCount}
                    danger={missingCount > 0}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {zoneTags.slice(0, 6).map((t) => (
                    <span
                      key={t.id}
                      title={t.name}
                      onClick={() => setSelectedTagId(t.id)}
                      className={cn(
                        "grid size-7 cursor-pointer place-items-center rounded-md transition",
                        t.id === selectedTagId
                          ? "bg-mint text-[#04221c]"
                          : "bg-surface-2 text-muted hover:text-text",
                      )}
                    >
                      <TagIcon icon={t.icon} className="size-4" />
                    </span>
                  ))}
                  {zoneTags.length === 0 && (
                    <span className="text-[11px] text-muted">등록된 자산 없음</span>
                  )}
                </div>

                {isActive && selectedTag && (
                  <div className="rounded-lg border border-mint/30 bg-mint/5 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text">{selectedTag.name}</span>
                      <StatusBadge status={selectedTag.status} />
                    </div>
                    <Button
                      variant="mint"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => onSearch(selectedTag)}
                    >
                      <Crosshair className="size-3.5" /> 탐색 시작
                    </Button>
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
      <span className={cn("mx-auto mb-1 flex justify-center", danger ? "text-danger" : "text-mint")}>
        {icon}
      </span>
      <p className={cn("text-sm font-bold", danger ? "text-danger" : "text-text")}>{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}
