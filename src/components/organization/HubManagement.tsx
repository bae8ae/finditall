"use client";

import { useState } from "react";
import {
  Router, Plus, RefreshCw, Pencil, Trash2, Wifi, Radius, Boxes,
} from "lucide-react";
import { Card, Button, SectionTitle, Modal, Field, Input, Select } from "../ui/primitives";
import { StatusBadge } from "../StatusBadge";
import { useHubs, useZones, useStore } from "@/lib/store";
import { useToast } from "../ui/toast";
import { timeAgo } from "@/lib/utils";
import type { Hub, HubStatus } from "@/lib/types";

export function HubManagement() {
  const hubs = useHubs("organization");
  const zones = useZones("organization");
  const { addHub, updateHub, deleteHub, rescanHub, addNotification, state } = useStore();
  const toast = useToast();

  const [editing, setEditing] = useState<Hub | null>(null);
  const [creating, setCreating] = useState(false);
  const [scanning, setScanning] = useState<string | null>(null);

  function rescan(h: Hub) {
    setScanning(h.id);
    setTimeout(() => {
      rescanHub(h.id);
      setScanning(null);
      toast({ kind: "success", title: "허브 재검색 완료", desc: h.name });
    }, 1200);
  }

  function remove(h: Hub) {
    deleteHub(h.id);
    addNotification({
      ownerType: "organization",
      kind: "warn",
      title: "허브 삭제",
      body: `${h.name}가 시스템에서 제거되었습니다.`,
    });
    toast({ kind: "warn", title: "허브 삭제됨", desc: h.name });
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        title="허브 / 구역 관리"
        desc="여러 층·구역의 FindIt Hub를 추가·수정·삭제"
        icon={<Router className="size-5" />}
        action={
          <Button variant="mint" onClick={() => setCreating(true)}>
            <Plus className="size-4" /> 허브 추가
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {hubs.map((h) => {
          const isScan = scanning === h.id;
          return (
            <Card key={h.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-11 place-items-center rounded-xl ${
                      h.status === "online"
                        ? "bg-mint/12 text-mint"
                        : h.status === "warning"
                          ? "bg-warn/12 text-warn"
                          : "bg-danger/12 text-danger"
                    }`}
                  >
                    <Wifi className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text">{h.name}</p>
                    <p className="text-xs text-muted">{h.zone}</p>
                  </div>
                </div>
                <StatusBadge status={h.status} type="hub" />
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-xl border border-border-soft bg-surface/40 p-2.5 text-center">
                <M icon={<Boxes className="size-3.5" />} label="자산" value={`${h.connectedTagsCount}`} />
                <M icon={<Radius className="size-3.5" />} label="반경" value={`${h.coverageRadius}m`} />
                <M
                  icon={<RefreshCw className="size-3.5" />}
                  label="동기화"
                  value={h.status === "offline" ? "—" : timeAgo(h.lastSyncAt, state.now)}
                />
              </div>

              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={isScan}
                  onClick={() => rescan(h)}
                >
                  <RefreshCw className={`size-3.5 ${isScan ? "animate-spin" : ""}`} />
                  {isScan ? "검색 중" : "재검색"}
                </Button>
                <Button variant="subtle" size="sm" onClick={() => setEditing(h)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => remove(h)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <HubModal
        open={creating || !!editing}
        hub={editing}
        zones={zones.map((z) => ({ id: z.id, name: z.name, floor: z.floor }))}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSave={(data) => {
          if (editing) {
            updateHub(editing.id, data);
            toast({ kind: "success", title: "허브 수정됨", desc: data.name });
          } else {
            addHub({
              ...data,
              status: "online",
              connectedTagsCount: 0,
              lastSyncAt: new Date().toISOString(),
              ownerType: "organization",
            } as Omit<Hub, "id">);
            addNotification({
              ownerType: "organization",
              kind: "ok",
              title: "허브 추가",
              body: `${data.name}가 ${data.zone}에 추가되었습니다.`,
            });
            toast({ kind: "success", title: "허브 추가됨", desc: data.name });
          }
          setCreating(false);
          setEditing(null);
        }}
      />
    </div>
  );
}

function M({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <span className="mx-auto mb-1 flex justify-center text-mint">{icon}</span>
      <p className="text-sm font-bold text-text">{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}

function HubModal({
  open,
  hub,
  zones,
  onClose,
  onSave,
}: {
  open: boolean;
  hub: Hub | null;
  zones: { id: string; name: string; floor: string }[];
  onClose: () => void;
  onSave: (data: Partial<Hub> & { name: string; zone: string; zoneId: string }) => void;
}) {
  const [name, setName] = useState("");
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");
  const [radius, setRadius] = useState(10);
  const [status, setStatus] = useState<HubStatus>("online");

  // sync when opening
  const key = hub?.id ?? "new";
  const [lastKey, setLastKey] = useState("");
  if (open && key !== lastKey) {
    setLastKey(key);
    setName(hub?.name ?? "");
    setZoneId(hub?.zoneId ?? zones[0]?.id ?? "");
    setRadius(hub?.coverageRadius ?? 10);
    setStatus(hub?.status ?? "online");
  }

  function submit() {
    if (!name.trim()) return;
    const zone = zones.find((z) => z.id === zoneId);
    onSave({
      name: name.trim(),
      zone: zone?.name ?? "",
      zoneId,
      coverageRadius: Number(radius),
      status,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={hub ? "허브 수정" : "허브 추가"}
      desc="구역에 설치된 FindIt Hub 정보를 입력하세요."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>취소</Button>
          <Button variant="mint" onClick={submit}>{hub ? "저장" : "추가"}</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="허브 이름" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 3층 검사실 허브" />
          </Field>
        </div>
        <Field label="설치 구역">
          <Select value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.name} · {z.floor}</option>
            ))}
          </Select>
        </Field>
        <Field label="커버리지 반경 (m)">
          <Input
            type="number"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </Field>
        <Field label="상태">
          <Select value={status} onChange={(e) => setStatus(e.target.value as HubStatus)}>
            <option value="online">온라인</option>
            <option value="warning">주의</option>
            <option value="offline">오프라인</option>
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
