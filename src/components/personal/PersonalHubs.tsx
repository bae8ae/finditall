"use client";

import { useState } from "react";
import { Wifi, RefreshCw, Radius, Tag as TagIco, Router } from "lucide-react";
import { Card, Button, SectionTitle } from "../ui/primitives";
import { StatusBadge } from "../StatusBadge";
import { useHubs, useStore } from "@/lib/store";
import { useToast } from "../ui/toast";
import { timeAgo } from "@/lib/utils";

export function PersonalHubs() {
  const hubs = useHubs("personal");
  const { rescanHub, addNotification, state } = useStore();
  const toast = useToast();
  const [scanning, setScanning] = useState<string | null>(null);

  function handleRescan(id: string, name: string) {
    setScanning(id);
    setTimeout(() => {
      rescanHub(id);
      setScanning(null);
      addNotification({
        ownerType: "personal",
        kind: "ok",
        title: "허브 재검색 완료",
        body: `${name}가 주변 태그를 다시 감지했습니다.`,
      });
      toast({ kind: "success", title: "재검색 완료", desc: name });
    }, 1400);
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        title="허브 관리"
        desc="집 안에 설치된 FindIt Hub를 관리합니다"
        icon={<Router className="size-5" />}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map((h) => {
          const isScan = scanning === h.id;
          return (
            <Card key={h.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-11 place-items-center rounded-xl ${h.status === "online" ? "bg-mint/12 text-mint" : "bg-danger/12 text-danger"}`}
                  >
                    <Wifi className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text">{h.name}</p>
                    <p className="text-xs text-muted">설치 위치 · {h.zone}</p>
                  </div>
                </div>
                <StatusBadge status={h.status} type="hub" />
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-xl border border-border-soft bg-surface/40 p-3 text-center">
                <Metric icon={<TagIco className="size-3.5" />} label="감지 태그" value={`${h.connectedTagsCount}`} />
                <Metric icon={<Radius className="size-3.5" />} label="커버리지" value={`${h.coverageRadius}m`} />
                <Metric
                  icon={<RefreshCw className="size-3.5" />}
                  label="동기화"
                  value={h.status === "online" ? timeAgo(h.lastSyncAt, state.now) : "—"}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isScan}
                onClick={() => handleRescan(h.id, h.name)}
              >
                <RefreshCw className={`size-3.5 ${isScan ? "animate-spin" : ""}`} />
                {isScan ? "재검색 중..." : "허브 재검색"}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="bg-surface/30 text-xs text-muted">
        💡 허브는 주변 배터리 없는 스티커 태그의 고유 ID와 신호 강도를 감지합니다.
        오프라인 허브는 전원과 네트워크 연결을 확인해주세요. 위치는 정확한 좌표가
        아닌 구역 단위로 추정됩니다.
      </Card>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <span className="mx-auto mb-1 flex justify-center text-mint">{icon}</span>
      <p className="text-sm font-bold text-text">{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}
