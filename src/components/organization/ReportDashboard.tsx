"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,
} from "recharts";
import {
  FileBarChart, TrendingDown, Clock, WifiOff, Lightbulb, Trophy, MapPin,
} from "lucide-react";
import { Card, Stat, SectionTitle } from "../ui/primitives";
import { useTags } from "@/lib/store";
import { useMemo } from "react";

const MONTHLY_MISSING = [
  { m: "1월", v: 9 },
  { m: "2월", v: 7 },
  { m: "3월", v: 11 },
  { m: "4월", v: 6 },
  { m: "5월", v: 4 },
];

const SEARCH_TIME = [
  { m: "1월", v: 14 },
  { m: "2월", v: 11 },
  { m: "3월", v: 9 },
  { m: "4월", v: 7 },
  { m: "5월", v: 5 },
];

const tooltipStyle = {
  background: "#111827",
  border: "1px solid #233045",
  borderRadius: 12,
  fontSize: 12,
  color: "#e7ecf6",
};

const SUGGESTIONS = [
  "연구실 B 허브 오프라인이 잦습니다. 전원·네트워크 점검 또는 허브 추가 설치를 권장합니다.",
  "촬영 장비 케이스 B07의 장기 미감지가 반복됩니다. 보관실 반출 절차에 태그 스캔을 의무화하세요.",
  "1층 로비는 자산 이동이 잦은 구역입니다. 커버리지 반경이 큰 허브로 교체를 검토하세요.",
  "마스터키·고중요도 자산에 반출 즉시 알림(지오펜스)을 적용하면 분실 의심 건수를 줄일 수 있습니다.",
];

export function ReportDashboard() {
  const tags = useTags("organization");

  const topAssets = useMemo(
    () =>
      [
        { name: "휠체어 3번", count: 42 },
        { name: "공용 태블릿 A12", count: 38 },
        { name: "이동식 초음파기", count: 27 },
        { name: "공용 노트북 12", count: 21 },
        { name: "마스터키 세트", count: 19 },
      ].filter((a) => tags.some((t) => t.name === a.name) || true),
    [tags],
  );

  return (
    <div className="space-y-5">
      <SectionTitle
        title="운영 리포트"
        desc="월간 자산 운영 지표 및 개선 제안"
        icon={<FileBarChart className="size-5" />}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="이번달 분실 의심" value="4건" icon={<TrendingDown className="size-5" />} tone="mint" sub="전월 대비 -33%" />
        <Stat label="평균 탐색 시간" value="5분" icon={<Clock className="size-5" />} tone="pink" sub="전월 대비 -29%" />
        <Stat label="허브 오프라인" value="3회" icon={<WifiOff className="size-5" />} tone="warn" sub="이번달 누적" />
        <Stat label="총 탐색 요청" value="612" icon={<FileBarChart className="size-5" />} tone="default" sub="이번달" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-4 text-sm font-semibold text-text">월간 분실 의심 자산 수</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_MISSING} margin={{ left: -20, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2740" vertical={false} />
              <XAxis dataKey="m" stroke="#8a99b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#8a99b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#161f33" }} />
              <Bar dataKey="v" fill="#fb6a72" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="mb-4 text-sm font-semibold text-text">평균 탐색 소요 시간 (분)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={SEARCH_TIME} margin={{ left: -20, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2740" vertical={false} />
              <XAxis dataKey="m" stroke="#8a99b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#8a99b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="v" stroke="#2fe0c0" strokeWidth={2.5} dot={{ r: 4, fill: "#2fe0c0" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
            <Trophy className="size-4 text-warn" /> 가장 자주 찾는 자산 TOP 5
          </p>
          <div className="space-y-2">
            {topAssets.map((a, i) => (
              <div key={a.name} className="flex items-center gap-3">
                <span
                  className={`grid size-6 place-items-center rounded-md text-xs font-bold ${
                    i === 0 ? "bg-warn/20 text-warn" : "bg-surface-2 text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-text">{a.name}</span>
                <div className="h-2 w-28 overflow-hidden rounded-full bg-bg-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink to-mint"
                    style={{ width: `${(a.count / topAssets[0].count) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-muted">{a.count}회</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
            <MapPin className="size-4 text-danger" /> 문제 발생이 많은 구역
          </p>
          <div className="space-y-2">
            {[
              { z: "장비 보관실", v: 38 },
              { z: "1층 로비", v: 31 },
              { z: "연구실 B", v: 24 },
              { z: "2층 병동", v: 18 },
            ].map((r, i) => (
              <div
                key={r.z}
                className="flex items-center justify-between rounded-lg border border-border-soft bg-surface/40 px-3 py-2.5"
              >
                <span className="text-sm text-text">{i + 1}. {r.z}</span>
                <span className="text-xs text-danger">{r.v}% 이슈 비중</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
          <Lightbulb className="size-4 text-mint" /> 자산 운영 개선 제안
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {SUGGESTIONS.map((s, i) => (
            <div
              key={i}
              className="flex gap-2.5 rounded-xl border border-mint/20 bg-mint/5 p-3 text-xs text-muted"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mint/20 text-[10px] font-bold text-mint">
                {i + 1}
              </span>
              {s}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
