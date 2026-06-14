"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button, Field, Input, Modal, Select, Textarea } from "./ui/primitives";
import { useStore, useZones } from "@/lib/store";
import { useToast } from "./ui/toast";
import { orgCategories } from "@/lib/mock-data";
import type { Importance } from "@/lib/types";

export function AddAssetModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addTag, addNotification } = useStore();
  const zones = useZones("organization");
  const toast = useToast();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState(orgCategories[0]);
  const [team, setTeam] = useState("");
  const [assignee, setAssignee] = useState("");
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");
  const [importance, setImportance] = useState<Importance>("normal");
  const [notes, setNotes] = useState("");

  const suggestCode = () =>
    `BOMI-U${String(Math.floor(Math.random() * 900) + 100)}`;

  function reset() {
    setName("");
    setCode("");
    setCategory(orgCategories[0]);
    setTeam("");
    setAssignee("");
    setImportance("normal");
    setNotes("");
  }

  function submit() {
    if (!name.trim()) {
      toast({ kind: "error", title: "이용자 이름을 입력해주세요." });
      return;
    }
    const zone = zones.find((item) => item.id === zoneId);
    addTag({
      tagCode: code.trim() || suggestCode(),
      name: name.trim().endsWith("님") ? name.trim() : `${name.trim()} 님`,
      category,
      ownerType: "organization",
      status: "normal",
      lastDetectedZone: zone?.name ?? "2층 생활실",
      lastDetectedHub: zone?.name ? `${zone.name} 허브` : "생활실 허브",
      signalStrength: 72,
      lastDetectedAt: new Date().toISOString(),
      icon: "user",
      department: team.trim() || "미지정",
      assignee: assignee.trim() || "미지정",
      importance,
      homeZoneId: zoneId,
      notes: notes.trim() || "생활 안전 이벤트 관리",
    });
    addNotification({
      ownerType: "organization",
      kind: "info",
      title: "이용자 등록",
      body: `${name.trim()} 님이 ${zone?.name ?? "생활실"} 관리 대상에 등록되었습니다.`,
    });
    toast({
      kind: "success",
      title: "이용자 등록 완료",
      desc: `${name.trim()} · ${team.trim() || "담당팀 미지정"}`,
    });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="새 이용자 등록"
      desc="생활 안전 이벤트를 관리할 이용자와 담당자 정보를 입력하세요."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button variant="mint" onClick={submit}>
            <UserPlus className="size-4" /> 이용자 등록
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="이용자 이름" required>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="예: 김영자"
          />
        </Field>
        <Field label="관리 ID" hint="비워두면 자동 생성됩니다.">
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="BOMI-U101"
            />
            <Button variant="subtle" size="sm" onClick={() => setCode(suggestCode())}>
              자동
            </Button>
          </div>
        </Field>
        <Field label="관리 유형">
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            {orgCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="담당팀">
          <Input
            value={team}
            onChange={(event) => setTeam(event.target.value)}
            placeholder="예: 생활지원 1팀"
          />
        </Field>
        <Field label="주 담당자">
          <Input
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            placeholder="담당자 이름"
          />
        </Field>
        <Field label="주 생활 구역">
          <Select value={zoneId} onChange={(event) => setZoneId(event.target.value)}>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name} · {zone.floor}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="확인 우선순위">
          <Select
            value={importance}
            onChange={(event) => setImportance(event.target.value as Importance)}
          >
            <option value="low">낮음</option>
            <option value="normal">보통</option>
            <option value="high">높음</option>
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="돌봄 메모">
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="예: 저녁 복약 확인 필요 / 외출 후 귀가 알림"
            />
          </Field>
        </div>
      </div>
    </Modal>
  );
}
