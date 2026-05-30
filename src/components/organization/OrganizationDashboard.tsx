"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import {
  Boxes, Radar, AlertTriangle, Wifi, Search, TrendingDown,
} from "lucide-react";
import { Card, Stat, SectionTitle } from "../ui/primitives";
import { StatusBadge } from "../StatusBadge";
import { useTags, useHubs, useZones, useStore } from "@/lib/store";

const WEEK = [
  { d: "월", n: 142 },
  { d: "화", n: 168 },
  { d: "수", n: 151 },
  { d: "목", n: 189 },
  { d: "금", n: 204 },
  { d: "토", n: 96 },
  { d: "일", n: 88 },
];

const PIE_COLORS = ["#f0509e", "#2fe0c0", "#60a5fa", "#fbbf24", "#a78bfa", "#fb6a72"];

const tooltipStyle = {
  background: "#111827",
  border: "1px solid #233045",
  borderRadius: 12,
  fontSize: 12,
  color: "#e7ecf6",
};

export function OrganizationDashboard() {
  const tags = useTags("organization");
  const hubs = useHubs("organization");
  const zones = useZones("organization");
  const { state } = useStore();

  const detecting = tags.filter(
    (t) => t.signalStrength > 0 && t.status !== "missing",
  ).length;
  const missing = tags.filter(
    (t) => t.status === "missing" || t.status === "lowSignal",
  ).length;
  const onlineHubs = hubs.filter((h) => h.status === "online").length;

  const catData = useMemo(() => {
    const m = new Map<string, number>();
    tags.forEach((t) => m.set(t.category, (m.get(t.category) ?? 0) + 1));
    return [...m.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [tags]);

  const zoneData = useMemo(
    () =>
      zones
        .map((z) => ({
          name: z.name.replace(/^\d+층\s*/, ""),
          자산: tags.filter((t) => t.homeZoneId === z.id).length,
        }))
        .filter((z) => z.자산 > 0),
    [zones, tags],
  );

  const alerts = tags.filter(
    (t) => t.status === "missing" || t.status === "searching" || t.status === "lowSignal",
  );

  return (
    <div className="space-y-5">
      <SectionTitle
        title="기관 자산 대시보드"
        desc="실내 공용 자산 통합 관제 · 허브 기반 구역 단위 추정"
        icon={<Boxes className="size-5" />}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="전체 자산" value={tags.length} icon={<Boxes className="size-5" />} tone="mint" />
        <Stat label="감지 중" value={detecting} icon={<Radar className="size-5" />} tone="mint" />
        <Stat label="분실 의심" value={missing} icon={<AlertTriangle className="size-5" />} tone="danger" />
        <Stat label="온라인 허브" value={`${onlineHubs}/${hubs.length}`} icon={<Wifi className="size-5" />} tone="default" />
        <Stat label="오늘 탐색 요청" value={37} icon={<Search className="size-5" />} tone="pink" />
        <Stat label="검색시간 감소" value="62%" icon={<TrendingDown className="size-5" />} tone="mint" sub="평균 대비" />
      </div>

      {/* charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="mb-4 text-sm font-semibold text-text">최근 7일 감지 로그 수</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={WEEK} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2fe0c0" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#2fe0c0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2740" />
              <XAxis dataKey="d" stroke="#8a99b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#8a99b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#161f33" }} />
              <Area type="monotone" dataKey="n" stroke="#2fe0c0" strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="mb-4 text-sm font-semibold text-text">카테고리별 분포</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={catData}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={78}
                paddingAngle={3}
              >
                {catData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {catData.map((c, i) => (
              <span key={c.name} className="flex items-center gap-1.5 text-[11px] text-muted">
                <span className="size-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {c.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="mb-4 text-sm font-semibold text-text">구역별 자산 밀집도</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={zoneData} margin={{ left: -20, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2740" vertical={false} />
              <XAxis dataKey="name" stroke="#8a99b8" fontSize={11} tickLine={false} interval={0} />
              <YAxis stroke="#8a99b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#161f33" }} />
              <Bar dataKey="자산" fill="#f0509e" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="mb-3 text-sm font-semibold text-text">주의 자산</p>
          <div className="space-y-2">
            {alerts.slice(0, 6).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-border-soft bg-surface/40 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{t.name}</p>
                  <p className="text-[11px] text-muted">{t.lastDetectedZone}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="py-6 text-center text-sm text-muted">주의 자산이 없습니다.</p>
            )}
          </div>
        </Card>
      </div>
      <p className="text-center text-[11px] text-muted">
        모든 수치는 프로토타입 더미 데이터 기반입니다 · 마지막 동기화 {new Date(state.now).getHours()}시 기준
      </p>
    </div>
  );
}
