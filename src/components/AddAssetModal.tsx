"use client";

import { useState } from "react";
import { PackagePlus } from "lucide-react";
import { Modal, Field, Input, Select, Textarea, Button } from "./ui/primitives";
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
  const [department, setDepartment] = useState("");
  const [assignee, setAssignee] = useState("");
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");
  const [importance, setImportance] = useState<Importance>("normal");
  const [notes, setNotes] = useState("");

  const suggestCode = () =>
    `TAG-${String.fromCharCode(72 + Math.floor(Math.random() * 6))}${
      Math.floor(Math.random() * 900) + 100
    }`;

  function reset() {
    setName("");
    setCode("");
    setCategory(orgCategories[0]);
    setDepartment("");
    setAssignee("");
    setImportance("normal");
    setNotes("");
  }

  function submit() {
    if (!name.trim()) {
      toast({ kind: "error", title: "자산명을 입력해주세요." });
      return;
    }
    const zone = zones.find((z) => z.id === zoneId);
    addTag({
      tagCode: code.trim() || suggestCode(),
      name: name.trim(),
      category,
      ownerType: "organization",
      status: "normal",
      lastDetectedZone: zone?.name ?? "장비 보관실",
      lastDetectedHub: zone?.name ? `${zone.name} 허브` : "보관실 허브",
      signalStrength: 68,
      lastDetectedAt: new Date().toISOString(),
      icon: "package",
      department: department.trim() || "미지정",
      assignee: assignee.trim() || "미지정",
      importance,
      homeZoneId: zoneId,
      notes: notes.trim(),
    });
    addNotification({
      ownerType: "organization",
      kind: "info",
      title: "자산 등록",
      body: `${name.trim()}이(가) ${zone?.name ?? "보관실"}에 등록되었습니다.`,
    });
    toast({
      kind: "success",
      title: "자산 등록 완료",
      desc: `${name.trim()} · ${department.trim() || "미지정"}`,
    });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="새 자산 등록"
      desc="배터리 없는 스티커 태그를 부착한 공용 자산을 등록합니다."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button variant="mint" onClick={submit}>
            <PackagePlus className="size-4" /> 자산 등록
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="자산명" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 휠체어 3번, 공용 노트북 12"
          />
        </Field>
        <Field label="태그 ID" hint="비워두면 자동 생성됩니다.">
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="TAG-H101"
            />
            <Button variant="subtle" size="sm" onClick={() => setCode(suggestCode())}>
              자동
            </Button>
          </div>
        </Field>
        <Field label="카테고리">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {orgCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="소속 부서">
          <Input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="예: 간호부, 연구1팀"
          />
        </Field>
        <Field label="담당자">
          <Input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="담당자 이름"
          />
        </Field>
        <Field label="설치/보관 구역">
          <Select value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} · {z.floor}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="중요도">
          <Select
            value={importance}
            onChange={(e) => setImportance(e.target.value as Importance)}
          >
            <option value="low">낮음</option>
            <option value="normal">보통</option>
            <option value="high">높음</option>
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="메모">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 반출 시 즉시 알림 / 정밀 장비"
            />
          </Field>
        </div>
      </div>
    </Modal>
  );
}
