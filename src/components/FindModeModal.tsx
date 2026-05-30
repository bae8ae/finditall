"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Crosshair, Wifi, MapPin, Lightbulb, CheckCircle2, AlertTriangle,
  Pause, Play, BellRing,
} from "lucide-react";
import { Modal, Button } from "./ui/primitives";
import { SignalRing } from "./SignalGauge";
import { TagIcon } from "./TagIcon";
import { DetectionTimeline } from "./DetectionTimeline";
import { useSignalSim } from "@/lib/useSignalSim";
import { useStore, useHubs, useLogs } from "@/lib/store";
import { useToast } from "./ui/toast";
import type { Tag } from "@/lib/types";

const SPOTS: Record<string, string[]> = {
  거실: ["거실 소파 주변", "TV 거치대 아래", "거실 테이블 위"],
  현관: ["신발장 위", "현관 콘솔 서랍", "우산꽂이 근처"],
  침실: ["침대 협탁 위", "옷장 선반", "이불 주변"],
  주방: ["식탁 위", "조리대 서랍", "냉장고 옆"],
  서재: ["책상 위", "책장 둘째 칸", "서랍 안쪽"],
};

function estimateSpot(zone: string): string {
  const list = SPOTS[zone];
  if (list) return list[Math.floor(Math.random() * list.length)];
  return `${zone} 내부 추정 위치`;
}

const PERSONAL_TIPS = [
  "허브 근처에서 천천히 이동해보세요.",
  "금속 물체나 벽 뒤에서는 신호가 약해질 수 있습니다.",
  "신호가 올라가는 방향으로 가까이 다가가세요.",
  "정확한 GPS가 아닌 구역 단위 추정이므로 주변을 함께 살펴보세요.",
];
const ORG_TIPS = [
  "해당 구역의 허브 반경 안에서 자산을 탐색하세요.",
  "신호 강도가 높을수록 허브와 가까운 위치입니다.",
  "지정 구역을 벗어난 자산은 반출/이탈 알림으로 확인하세요.",
  "장기 미감지 자산은 마지막 감지 허브부터 확인하는 것이 빠릅니다.",
];

export function FindModeModal({
  tag,
  open,
  onClose,
  variant,
}: {
  tag: Tag | null;
  open: boolean;
  onClose: () => void;
  variant: "personal" | "organization";
}) {
  const sim = useSignalSim(tag?.signalStrength ?? 55, true);
  const hubs = useHubs(variant);
  const logs = useLogs(variant);
  const { markFound, reportMissing, addNotification, addLog, state } = useStore();
  const toast = useToast();
  const [spot, setSpot] = useState("");
  const [spotKey, setSpotKey] = useState("");

  // derive an estimated spot when the target/open changes (render-time sync)
  const openKey = open && tag ? tag.id : "";
  if (openKey && openKey !== spotKey) {
    setSpotKey(openKey);
    setSpot(estimateSpot(tag!.lastDetectedZone));
  }

  const closestHub = useMemo(() => {
    if (!tag) return null;
    return (
      hubs.find((h) => h.name === tag.lastDetectedHub) ??
      hubs.find((h) => h.zone === tag.lastDetectedZone) ??
      hubs.find((h) => h.status === "online") ??
      hubs[0] ??
      null
    );
  }, [hubs, tag]);

  // generate a detection log entry each time the modal opens
  useEffect(() => {
    if (open && tag && closestHub) {
      addLog({
        tagId: tag.id,
        tagName: tag.name,
        hubId: closestHub.id,
        hubName: closestHub.name,
        zone: tag.lastDetectedZone,
        signalStrength: sim.value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tag?.id]);

  if (!tag) return null;

  const tips = variant === "personal" ? PERSONAL_TIPS : ORG_TIPS;
  const tagLogs = logs.filter((l) => l.tagId === tag.id).slice(0, 5);

  function handleFound() {
    markFound(tag!.id);
    addNotification({
      ownerType: variant,
      kind: "ok",
      title: "찾음 처리",
      body: `${tag!.name}을(를) 찾음 처리했습니다. (${tag!.lastDetectedZone})`,
    });
    toast({ kind: "success", title: "찾음 처리 완료", desc: tag!.name });
    onClose();
  }

  function handleMissing() {
    reportMissing(tag!.id);
    addNotification({
      ownerType: variant,
      kind: "danger",
      title: variant === "personal" ? "분실 신고" : "분실 상태 변경",
      body: `${tag!.name}을(를) 미감지/분실 상태로 변경했습니다.`,
    });
    toast({ kind: "warn", title: "분실 상태로 변경됨", desc: tag!.name });
    onClose();
  }

  function notifyAssignee() {
    addNotification({
      ownerType: "organization",
      kind: "info",
      title: "담당자 알림 전송",
      body: `${tag!.assignee ?? "담당자"}님에게 ${tag!.name} 탐색 요청을 보냈습니다.`,
    });
    toast({
      kind: "info",
      title: "담당자에게 알림 전송",
      desc: `${tag!.assignee ?? "담당자"} · ${tag!.department ?? ""}`,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={variant === "personal" ? "찾기 모드" : "자산 탐색 모드"}
      desc="허브 신호 강도 기반 근접 탐색 · 구역 단위 위치 추정"
    >
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* left: gauge */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-soft bg-bg-2/60 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-mint">
              <TagIcon icon={tag.icon} className="size-4" />
            </span>
            {tag.name}
          </div>
          <SignalRing value={sim.value} trend={sim.trend} size={190} />
          <div className="flex gap-2">
            <Button variant="subtle" size="sm" onClick={sim.toggle}>
              {sim.running ? (
                <>
                  <Pause className="size-3.5" /> 일시정지
                </>
              ) : (
                <>
                  <Play className="size-3.5" /> 재개
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={sim.ping}>
              <Crosshair className="size-3.5" /> 신호 측정
            </Button>
          </div>
          <p className="text-center text-[11px] text-muted">
            실제 하드웨어 없이 신호값을 시뮬레이션합니다 (40~95 변동).
          </p>
        </div>

        {/* right: details */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InfoTile
              icon={<span className="font-mono text-[11px]">ID</span>}
              label="태그 ID"
              value={tag.tagCode}
            />
            <InfoTile
              icon={<Wifi className="size-4" />}
              label="가장 강한 허브"
              value={closestHub?.name ?? "—"}
            />
            <InfoTile
              icon={<MapPin className="size-4" />}
              label="마지막 감지 구역"
              value={tag.lastDetectedZone}
            />
            <InfoTile
              icon={<Crosshair className="size-4" />}
              label="예상 위치"
              value={spot}
            />
          </div>

          {variant === "organization" && (
            <div className="rounded-xl border border-border-soft bg-surface/40 p-3 text-xs text-muted">
              담당: <span className="text-text">{tag.assignee}</span> · 부서:{" "}
              <span className="text-text">{tag.department}</span>
            </div>
          )}

          <div className="rounded-xl border border-mint/20 bg-mint/5 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-mint">
              <Lightbulb className="size-3.5" /> 주변 탐색 팁
            </p>
            <ul className="space-y-1 text-xs text-muted">
              {tips.map((t) => (
                <li key={t} className="flex gap-1.5">
                  <span className="text-mint">·</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {variant === "organization" && tagLogs.length > 0 && (
            <div className="rounded-xl border border-border-soft bg-surface/40 p-3">
              <p className="mb-2 text-xs font-semibold text-text">
                최근 감지 로그
              </p>
              <DetectionTimeline logs={tagLogs} now={state.now} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {variant === "organization" && (
          <Button variant="outline" onClick={notifyAssignee}>
            <BellRing className="size-4" /> 담당자에게 알림
          </Button>
        )}
        <Button variant="danger" onClick={handleMissing}>
          <AlertTriangle className="size-4" />
          {variant === "personal" ? "분실 신고" : "분실 상태로 변경"}
        </Button>
        <Button variant="mint" onClick={handleFound}>
          <CheckCircle2 className="size-4" /> 찾음 처리
        </Button>
      </div>
    </Modal>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface/40 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted">
        <span className="text-mint">{icon}</span>
        {label}
      </div>
      <p className="truncate text-sm font-semibold text-text">{value}</p>
    </div>
  );
}
