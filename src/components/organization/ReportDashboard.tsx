"use client";

import {
  BellRing,
  CheckCircle2,
  Clock3,
  FileBarChart,
  Lightbulb,
  Pill,
  Router,
} from "lucide-react";
import { Card, SectionTitle, Stat } from "../ui/primitives";

const MONTHS = [
  { month: "1월", events: 72, response: 68 },
  { month: "2월", events: 64, response: 74 },
  { month: "3월", events: 81, response: 78 },
  { month: "4월", events: 59, response: 86 },
  { month: "5월", events: 47, response: 91 },
];

const SUGGESTIONS = [
  "3층 생활실 허브의 오프라인 이력이 반복됩니다. 전원·네트워크 점검과 예비 허브 배치를 권장합니다.",
  "박순옥 님의 저녁 복약 미확인이 반복됩니다. 담당자 알림 시간을 15분 앞당겨 확인해보세요.",
  "1층 현관은 외출·귀가 이벤트가 집중됩니다. 교대 시간 담당자 알림 분배를 점검하세요.",
  "장시간 무반응 이벤트는 생활 패턴과 함께 검토하고, 응급 상황은 전화 또는 현장 확인 절차로 연결하세요.",
];

export function ReportDashboard() {
  return (
    <div className="space-y-5">
      <SectionTitle
        title="돌봄 운영 리포트"
        desc="생활 안전 이벤트, 담당자 대응, 복약 확인과 허브 운영 추세"
        icon={<FileBarChart className="size-5" />}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="이번 달 확인 필요 이벤트"
          value="47건"
          icon={<BellRing className="size-5" />}
          tone="warn"
          sub="전월 대비 -20%"
        />
        <Stat
          label="평균 담당자 확인 시간"
          value="4.8분"
          icon={<Clock3 className="size-5" />}
          tone="pink"
          sub="전월 대비 -1.2분"
        />
        <Stat
          label="복약 확인율"
          value="94%"
          icon={<Pill className="size-5" />}
          tone="mint"
          sub="이번 달"
        />
        <Stat
          label="허브 가동률"
          value="98.7%"
          icon={<Router className="size-5" />}
          tone="mint"
          sub="전체 구역 평균"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold text-text">
            월별 확인 필요 이벤트
          </p>
          <p className="mt-1 text-xs text-muted">
            무반응, 복약 미확인, 귀가 확인, 허브 이상 합계
          </p>
          <div className="mt-6 flex h-56 items-end justify-between gap-3 border-b border-border-soft px-2">
            {MONTHS.map((item) => (
              <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end">
                <span className="mb-2 text-xs font-semibold text-text">
                  {item.events}
                </span>
                <div
                  className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-pink/35 to-pink"
                  style={{ height: `${item.events}%` }}
                />
                <span className="mt-2 pb-2 text-[11px] text-muted">{item.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-text">담당자 확인률</p>
          <p className="mt-1 text-xs text-muted">
            기관 담당자가 이벤트를 확인 또는 조치 완료한 비율
          </p>
          <div className="mt-6 space-y-4">
            {MONTHS.map((item) => (
              <div key={item.month}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted">{item.month}</span>
                  <span className="font-semibold text-text">{item.response}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-bg-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-mint to-mint-soft"
                    style={{ width: `${item.response}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-text">
            <CheckCircle2 className="size-4 text-mint" /> 주요 이벤트 분포
          </p>
          <div className="space-y-3">
            {[
              { label: "활동 감지", value: 76, count: "318건", color: "bg-mint" },
              { label: "복약 확인/미확인", value: 52, count: "126건", color: "bg-pink" },
              { label: "외출·귀가", value: 38, count: "84건", color: "bg-info" },
              { label: "장시간 무반응", value: 21, count: "23건", color: "bg-warn" },
              { label: "낙상 의심", value: 8, count: "4건", color: "bg-danger" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted">{item.label}</span>
                  <span className="font-medium text-text">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-bg-2">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-text">
            <Router className="size-4 text-mint" /> 구역별 운영 상태
          </p>
          <div className="space-y-2.5">
            {[
              { zone: "2층 생활실", status: "안정", value: "99.4%" },
              { zone: "2층 복약함", status: "안정", value: "99.1%" },
              { zone: "1층 현관", status: "안정", value: "98.8%" },
              { zone: "3층 생활실", status: "점검 필요", value: "93.2%" },
            ].map((item) => (
              <div
                key={item.zone}
                className="flex items-center justify-between rounded-xl border border-border-soft bg-surface/35 px-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-text">{item.zone}</p>
                  <p className={item.status === "안정" ? "text-[11px] text-mint" : "text-[11px] text-warn"}>
                    {item.status}
                  </p>
                </div>
                <span className="text-sm font-semibold text-text">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
          <Lightbulb className="size-4 text-pink-soft" /> 돌봄 운영 제안
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {SUGGESTIONS.map((suggestion, index) => (
            <div
              key={suggestion}
              className="flex gap-2.5 rounded-xl border border-mint/20 bg-mint/5 p-3 text-xs leading-relaxed text-muted"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mint/20 text-[10px] font-bold text-mint">
                {index + 1}
              </span>
              {suggestion}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
