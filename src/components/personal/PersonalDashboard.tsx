"use client";

import {
  Activity,
  ArrowRight,
  BellRing,
  Clock3,
  HeartPulse,
  Home,
  ShieldCheck,
  TimerReset,
  Wifi,
} from "lucide-react";
import { Button, Card, SectionTitle, Stat } from "../ui/primitives";
import { useHubs, useStore } from "@/lib/store";
import { personalCareEvents } from "@/lib/mock-data";
import { StatusBadge } from "../StatusBadge";

const ACTIVITY = [20, 14, 12, 18, 31, 48, 62, 54, 68, 73, 66, 58, 46];

export function PersonalDashboard({
  goItems,
  goVital,
}: {
  goItems: () => void;
  goVital: () => void;
}) {
  const hubs = useHubs("personal");
  const { state } = useStore();
  const events = personalCareEvents(state.now).slice(0, 5);

  return (
    <div className="space-y-5">
      <Card className="flex flex-col items-start justify-between gap-5 bg-gradient-to-br from-pink/10 via-surface/40 to-mint/8 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-pink-soft">BOMI Family</p>
          <h2 className="mt-1 text-xl font-bold text-text sm:text-2xl">
            오늘도 부모님의 일상을 조용히 확인하고 있습니다.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            영상 대신 생활 신호를 이벤트로 바꾸어, 보호자가 확인할 순간만
            알려드립니다.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" onClick={goItems}>
            복약·물품 보기
          </Button>
          <Button variant="primary" onClick={goVital}>
            <HeartPulse className="size-4" /> 신호 데모
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="현재 상태"
          value="재실"
          icon={<Home className="size-5" />}
          tone="mint"
          sub="거실에서 활동 감지"
        />
        <Stat
          label="마지막 활동 시각"
          value="10:24"
          icon={<Clock3 className="size-5" />}
          tone="pink"
          sub="오늘"
        />
        <Stat
          label="무반응 시간"
          value="07:32"
          icon={<TimerReset className="size-5" />}
          tone="warn"
          sub="기준 20분"
        />
        <Stat
          label="오늘 이벤트"
          value="5건"
          icon={<BellRing className="size-5" />}
          tone="default"
          sub="확인 필요 1건"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <SectionTitle
            title="활동 추세"
            desc="시간대별 생활 신호 변화 · 수치가 아닌 상대적 활동 수준"
            icon={<Activity className="size-5" />}
          />
          <div className="rounded-2xl border border-border-soft bg-bg-2/55 p-4 sm:p-5">
            <div className="grid grid-cols-[36px_1fr] gap-3">
              <div className="flex h-52 flex-col justify-between py-1 text-[10px] text-muted">
                <span>높음</span>
                <span>보통</span>
                <span>낮음</span>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex flex-col justify-between">
                  <span className="border-t border-dashed border-border-soft" />
                  <span className="border-t border-dashed border-border-soft" />
                  <span className="border-t border-dashed border-border-soft" />
                </div>
                <div className="relative flex h-52 items-end gap-1.5">
                  {ACTIVITY.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-mint/35 to-mint transition hover:brightness-110"
                      style={{ height: `${height}%` }}
                      title={`활동 수준 ${height}`}
                    />
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-[10px] text-muted">
                  <span>00시</span>
                  <span>06시</span>
                  <span>12시</span>
                  <span>18시</span>
                  <span>24시</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-mint/12 px-3 py-1 text-mint">
                평소 오전 패턴과 유사
              </span>
              <span className="rounded-full bg-surface-2 px-3 py-1 text-muted">
                카메라 영상 저장 없음
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="최근 이벤트"
            desc="보호자에게 의미 있는 변화만 정리합니다."
            icon={<ShieldCheck className="size-5" />}
            action={
              <Button variant="ghost" size="sm" onClick={goItems}>
                물품 보기 <ArrowRight className="size-4" />
              </Button>
            }
          />
          <div className="space-y-2.5">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-xl border border-border-soft bg-surface/35 p-3"
              >
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${
                    event.severity === "warning"
                      ? "bg-warn"
                      : event.severity === "critical"
                        ? "bg-danger"
                        : "bg-mint"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-text">
                    {event.description}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    {event.guardianNotified
                      ? "보호자 알림 전송"
                      : "보호자 알림 없음"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-text">
            <Wifi className="size-4 text-mint" /> BOMI Hub 상태
          </p>
          <p className="mt-1 text-xs text-muted">
            CSI 생활 신호와 RFID 필수 물품 감지를 함께 처리합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hubs.map((hub) => (
            <div
              key={hub.id}
              className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface/40 px-3 py-2"
            >
              <span className="text-xs text-text">{hub.name}</span>
              <StatusBadge status={hub.status} type="hub" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
