"use client";

import {
  Package, Radar, Clock, SignalLow, Wifi, Search, ArrowRight,
} from "lucide-react";
import { Card, Stat, Button, SectionTitle } from "../ui/primitives";
import { StatusBadge } from "../StatusBadge";
import { SignalBar } from "../SignalGauge";
import { TagIcon } from "../TagIcon";
import { useTags, useHubs, useLogs, useStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";
import type { Tag } from "@/lib/types";

export function PersonalDashboard({
  onFind,
  goItems,
}: {
  onFind: (t: Tag) => void;
  goItems: () => void;
}) {
  const tags = useTags("personal");
  const hubs = useHubs("personal");
  const logs = useLogs("personal");
  const { state } = useStore();

  const detecting = tags.filter(
    (t) => t.signalStrength > 0 && t.status !== "missing",
  ).length;
  const weak = tags.filter(
    (t) => t.status === "lowSignal" || t.status === "missing",
  ).length;
  const onlineHubs = hubs.filter((h) => h.status === "online").length;
  const recentFound = [...tags]
    .filter((t) => t.status === "normal")
    .sort(
      (a, b) =>
        new Date(b.lastDetectedAt).getTime() -
        new Date(a.lastDetectedAt).getTime(),
    )
    .slice(0, 4);

  const strongest = [...tags].sort((a, b) => b.signalStrength - a.signalStrength)[0];

  return (
    <div className="space-y-5">
      {/* hero strip */}
      <Card className="flex flex-col items-start justify-between gap-4 bg-gradient-to-br from-pink/10 via-surface/40 to-mint/5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted">안녕하세요 👋 집 안 물건을</p>
          <h2 className="text-xl font-bold text-text">
            구역 단위로 빠르게 찾아보세요
          </h2>
          <p className="mt-1 text-xs text-muted">
            배터리 없는 스티커 태그 · 허브 신호 강도 기반 근접 탐색
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => strongest && onFind(strongest)}
        >
          <Search className="size-5" /> 지금 찾기
        </Button>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="등록된 물건"
          value={tags.length}
          icon={<Package className="size-5" />}
          tone="pink"
          sub="개의 스티커 태그"
        />
        <Stat
          label="현재 감지 중"
          value={detecting}
          icon={<Radar className="size-5" />}
          tone="mint"
          sub="실시간 신호 수신"
        />
        <Stat
          label="신호 약함 / 미감지"
          value={weak}
          icon={<SignalLow className="size-5" />}
          tone="warn"
          sub="확인이 필요해요"
        />
        <Stat
          label="허브 온라인"
          value={`${onlineHubs}/${hubs.length}`}
          icon={<Wifi className="size-5" />}
          tone="mint"
          sub="설치된 FindIt Hub"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* recent found */}
        <Card className="lg:col-span-2">
          <SectionTitle
            title="최근 감지된 물건"
            desc="가장 최근에 허브가 감지한 물건"
            icon={<Clock className="size-5" />}
            action={
              <Button variant="ghost" size="sm" onClick={goItems}>
                전체 보기 <ArrowRight className="size-4" />
              </Button>
            }
          />
          <div className="space-y-2.5">
            {recentFound.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-border-soft bg-surface/40 p-3"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-pink-soft">
                  <TagIcon icon={t.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-text">
                      {t.name}
                    </p>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs text-muted">
                    {t.lastDetectedZone} · {timeAgo(t.lastDetectedAt, state.now)}
                  </p>
                </div>
                <div className="hidden w-32 sm:block">
                  <SignalBar value={t.signalStrength} showLabel={false} />
                </div>
                <Button variant="subtle" size="sm" onClick={() => onFind(t)}>
                  찾기
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* hub status + log feed */}
        <div className="space-y-5">
          <Card>
            <SectionTitle title="허브 상태" icon={<Wifi className="size-5" />} />
            <div className="space-y-2">
              {hubs.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-lg border border-border-soft bg-surface/40 px-3 py-2"
                >
                  <span className="text-sm text-text">{h.name}</span>
                  <StatusBadge status={h.status} type="hub" />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <SectionTitle title="감지 피드" icon={<Radar className="size-5" />} />
            <ul className="space-y-2.5">
              {logs.slice(0, 4).map((l) => (
                <li key={l.id} className="flex items-center gap-2 text-xs">
                  <span className="size-1.5 rounded-full bg-mint" />
                  <span className="font-medium text-text">{l.tagName}</span>
                  <span className="text-muted">{l.zone}</span>
                  <span className="ml-auto text-muted/70">
                    {timeAgo(l.timestamp, state.now)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
