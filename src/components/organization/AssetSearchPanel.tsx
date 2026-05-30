"use client";

import { useState } from "react";
import {
  Crosshair, Search, LogOut, Zap, AlertTriangle, MapPin, ArrowRight,
} from "lucide-react";
import { Card, Button, SectionTitle, Input } from "../ui/primitives";
import { StatusBadge } from "../StatusBadge";
import { TagIcon } from "../TagIcon";
import { useTags, useZones, useStore, useNotifications } from "@/lib/store";
import { useToast } from "../ui/toast";
import { timeAgo } from "@/lib/utils";
import type { Tag } from "@/lib/types";

export function AssetSearchPanel({ onSearch }: { onSearch: (t: Tag) => void }) {
  const tags = useTags("organization");
  const zones = useZones("organization");
  const { state, updateTag, addNotification } = useStore();
  const geofenceAlerts = useNotifications("organization").filter((n) =>
    ["구역 이탈", "지정 구역 밖 감지", "장기 미감지"].includes(n.title),
  );
  const toast = useToast();
  const [q, setQ] = useState("");

  const results = tags.filter(
    (t) =>
      !q ||
      t.name.toLowerCase().includes(q.toLowerCase()) ||
      t.tagCode.toLowerCase().includes(q.toLowerCase()),
  );

  // simulate an asset leaving its assigned zone
  function simulateExit() {
    const candidate =
      tags.find((t) => t.status === "normal" && t.importance === "high") ??
      tags[0];
    if (!candidate) return;
    const otherZone =
      zones.find((z) => z.id !== candidate.homeZoneId) ?? zones[0];
    updateTag(candidate.id, {
      status: "searching",
      lastDetectedZone: otherZone.name,
      lastDetectedHub: `${otherZone.name} 허브`,
    });
    addNotification({
      ownerType: "organization",
      kind: "danger",
      title: "구역 이탈",
      body: `${candidate.name}이(가) 지정 구역을 벗어나 ${otherZone.name}에서 감지되었습니다.`,
    });
    toast({
      kind: "warn",
      title: "반출/이탈 감지",
      desc: `${candidate.name} → ${otherZone.name}`,
    });
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        title="자산 탐색 & 이탈 알림"
        desc="자산을 선택해 탐색 모드를 열고, 지정 구역 이탈을 모니터링합니다"
        icon={<Crosshair className="size-5" />}
        action={
          <Button variant="outline" onClick={simulateExit}>
            <Zap className="size-4" /> 이탈 시뮬레이션
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* quick search */}
        <Card>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="탐색할 자산 검색 (이름 · 태그 ID)"
              className="pl-9"
            />
          </div>
          <div className="max-h-[460px] space-y-2 overflow-y-auto pr-1">
            {results.map((t) => (
              <button
                key={t.id}
                onClick={() => onSearch(t)}
                className="flex w-full items-center gap-3 rounded-xl border border-border-soft bg-surface/40 p-3 text-left transition hover:border-mint/40"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-mint">
                  <TagIcon icon={t.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-text">{t.name}</p>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs text-muted">
                    {t.lastDetectedZone} · {t.department} · {timeAgo(t.lastDetectedAt, state.now)}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-mint">
                  탐색 <ArrowRight className="size-3.5" />
                </span>
              </button>
            ))}
            {results.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">검색 결과가 없습니다.</p>
            )}
          </div>
        </Card>

        {/* geofence alerts */}
        <Card className="h-fit">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
            <LogOut className="size-4 text-danger" /> 반출 / 이탈 알림
          </p>
          <div className="space-y-2.5">
            {geofenceAlerts.length === 0 && (
              <p className="py-6 text-center text-xs text-muted">
                현재 이탈 알림이 없습니다.
              </p>
            )}
            {geofenceAlerts.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-danger/25 bg-danger/5 p-3"
              >
                <p className="flex items-center gap-1.5 text-xs font-semibold text-danger">
                  <AlertTriangle className="size-3.5" /> {a.title}
                </p>
                <p className="mt-1 text-xs text-muted">{a.body}</p>
                <p className="mt-1 text-[11px] text-muted/70">
                  {timeAgo(a.timestamp, state.now)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-border-soft bg-surface/40 p-2.5 text-[11px] text-muted">
            <MapPin className="mr-1 inline size-3 text-mint" />
            지정 구역을 벗어난 자산은 가장 가까운 허브 기준으로 구역 단위 추정됩니다.
          </div>
        </Card>
      </div>
    </div>
  );
}
