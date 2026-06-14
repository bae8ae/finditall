"use client";

import { useState } from "react";
import { Users, ShieldCheck, KeyRound, MapPin, Crosshair, ArrowLeft } from "lucide-react";
import { Modal, Button, Field, Input } from "../ui/primitives";
import { SignalBar } from "../SignalGauge";
import { TagIcon } from "../TagIcon";
import { useTags, useStore } from "@/lib/store";
import { useToast } from "../ui/toast";
import { timeAgo } from "@/lib/utils";
import type { Tag } from "@/lib/types";

const DEMO_CODE = "BOMI-7788";

export function GuestFindModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const tags = useTags("personal");
  const { state } = useStore();
  const toast = useToast();
  const allowed = tags.filter((t) =>
    ["휴대폰", "지갑", "열쇠"].includes(t.name),
  );

  const [step, setStep] = useState<"code" | "select" | "result">("code");
  const [code, setCode] = useState("");
  const [picked, setPicked] = useState<Tag | null>(null);

  function close() {
    setStep("code");
    setCode("");
    setPicked(null);
    onClose();
  }

  function verify() {
    if (code.trim().toUpperCase() === DEMO_CODE) {
      toast({ kind: "success", title: "임시 접근 코드 확인됨" });
      setStep("select");
    } else {
      toast({
        kind: "error",
        title: "코드가 일치하지 않습니다.",
        desc: `데모 코드: ${DEMO_CODE}`,
      });
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="가족 임시 위치 확인"
      desc="보호자가 허용한 필수 물품만 임시로 확인할 수 있습니다."
    >
      {/* privacy banner */}
      <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-mint/25 bg-mint/5 p-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-mint" />
        <p className="text-xs text-muted">
          가족 임시 위치 확인은 보호자가 허용한 필수 물품만 제공합니다. 위치
          정보는 확인 세션 동안에만 표시되며 저장되지 않습니다.
        </p>
      </div>

      {step === "code" && (
        <div className="space-y-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-pink-soft">
            <KeyRound className="size-7" />
          </div>
          <p className="text-sm text-text">
            보호자 기기에서 발급한 임시 접근 코드로 필수 물품의 마지막 감지
            구역을 확인하세요.
          </p>
          <Field label="임시 접근 코드" hint={`데모 코드: ${DEMO_CODE}`}>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="BOMI-XXXX"
              onKeyDown={(e) => e.key === "Enter" && verify()}
            />
          </Field>
          <Button variant="primary" className="w-full" onClick={verify}>
            <Users className="size-4" /> 임시 위치 확인
          </Button>
        </div>
      )}

      {step === "select" && (
        <div className="space-y-3">
          <p className="text-sm text-muted">확인할 필수 물품을 선택하세요.</p>
          {allowed.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setPicked(t);
                setStep("result");
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-border-soft bg-surface/40 p-3 text-left transition hover:border-mint/40"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-pink-soft">
                <TagIcon icon={t.icon} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">{t.name}</p>
                <p className="text-xs text-muted">보호자 허용됨 · 임시 확인 가능</p>
              </div>
              <Crosshair className="size-4 text-mint" />
            </button>
          ))}
        </div>
      )}

      {step === "result" && picked && (
        <div className="space-y-4">
          <button
            onClick={() => setStep("select")}
            className="flex items-center gap-1 text-xs text-muted hover:text-text"
          >
            <ArrowLeft className="size-3.5" /> 다른 기기 선택
          </button>
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-surface-2 text-pink-soft">
              <TagIcon icon={picked.icon} className="size-6" />
            </span>
            <div>
              <p className="text-sm font-bold text-text">{picked.name}</p>
              <p className="text-xs text-muted">{picked.tagCode}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border-soft bg-surface/40 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-mint">
              <MapPin className="size-4" /> 마지막 감지 위치
            </p>
            <p className="text-sm text-text">
              {picked.lastDetectedZone} · {picked.lastDetectedHub}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {timeAgo(picked.lastDetectedAt, state.now)} 감지
            </p>
            <div className="mt-3">
              <SignalBar value={picked.signalStrength} />
            </div>
          </div>
          <p className="text-[11px] text-muted">
            ※ 구역 단위 위치 감지입니다. 확인 세션 종료 시 접근 권한은 자동
            만료됩니다.
          </p>
        </div>
      )}
    </Modal>
  );
}
