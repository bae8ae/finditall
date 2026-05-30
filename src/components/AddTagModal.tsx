"use client";

import { useState } from "react";
import { StickyNote } from "lucide-react";
import { Modal, Field, Input, Select, Textarea, Button } from "./ui/primitives";
import { useStore, useZones } from "@/lib/store";
import { useToast } from "./ui/toast";
import { personalCategories } from "@/lib/mock-data";

export function AddTagModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addTag, addNotification } = useStore();
  const zones = useZones("personal");
  const toast = useToast();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState(personalCategories[0]);
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");
  const [notes, setNotes] = useState("");

  const suggestCode = () =>
    `TAG-A${String(Math.floor(Math.random() * 900) + 100)}`;

  function reset() {
    setName("");
    setCode("");
    setCategory(personalCategories[0]);
    setZoneId(zones[0]?.id ?? "");
    setNotes("");
  }

  function submit() {
    if (!name.trim()) {
      toast({ kind: "error", title: "물건 이름을 입력해주세요." });
      return;
    }
    const zone = zones.find((z) => z.id === zoneId);
    addTag({
      tagCode: code.trim() || suggestCode(),
      name: name.trim(),
      category,
      ownerType: "personal",
      status: "normal",
      lastDetectedZone: zone?.name ?? "거실",
      lastDetectedHub: zone?.name ? `${zone.name} 허브` : "거실 허브",
      signalStrength: 70,
      lastDetectedAt: new Date().toISOString(),
      icon: iconFor(category),
      notes: notes.trim(),
      homeZoneId: zoneId,
    });
    addNotification({
      ownerType: "personal",
      kind: "ok",
      title: "새 태그 등록",
      body: `${name.trim()}에 배터리 없는 스티커 태그를 등록했습니다.`,
    });
    toast({
      kind: "success",
      title: "스티커 태그 등록 완료",
      desc: `${name.trim()} · ${category}`,
    });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="새 스티커 태그 등록"
      desc="배터리 없는 스티커 태그를 물건에 붙이고 정보를 입력하세요."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={submit}>
            <StickyNote className="size-4" /> 등록하기
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="물건 이름" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 지갑, 열쇠, 리모컨"
          />
        </Field>
        <Field label="태그 ID" hint="비워두면 자동 생성됩니다.">
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="TAG-A001"
            />
            <Button variant="subtle" size="sm" onClick={() => setCode(suggestCode())}>
              자동
            </Button>
          </div>
        </Field>
        <Field label="카테고리">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {personalCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="주 사용 공간">
          <Select value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="메모">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 갈색 가죽 반지갑 / 소파 쿠션 사이에 자주 들어감"
            />
          </Field>
        </div>
      </div>
    </Modal>
  );
}

function iconFor(category: string): string {
  const map: Record<string, string> = {
    지갑: "wallet",
    열쇠: "key",
    리모컨: "tv",
    "안경 케이스": "glasses",
    스마트폰: "smartphone",
    "학생증/사원증": "id-card",
    약통: "pill",
    "서류/파일": "folder",
    기타: "headphones",
  };
  return map[category] ?? "headphones";
}
