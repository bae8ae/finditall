"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Crosshair, Table2, Filter } from "lucide-react";
import { Card, Button, Input, Select, SectionTitle, Chip } from "../ui/primitives";
import { StatusBadge, ImportanceBadge } from "../StatusBadge";
import { TagIcon } from "../TagIcon";
import { useTags, useZones, useStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";
import type { Tag, TagStatus } from "@/lib/types";

const STATUS_FILTERS: { key: TagStatus | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "normal", label: "정상" },
  { key: "searching", label: "탐색 중" },
  { key: "lowSignal", label: "신호 약함" },
  { key: "missing", label: "분실 의심" },
];

export function AssetTable({
  onSearch,
  onAdd,
}: {
  onSearch: (t: Tag) => void;
  onAdd: () => void;
}) {
  const tags = useTags("organization");
  const zones = useZones("organization");
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [zone, setZone] = useState("all");
  const [status, setStatus] = useState<TagStatus | "all">("all");
  const [sort, setSort] = useState("recent");

  const departments = useMemo(
    () => [...new Set(tags.map((t) => t.department).filter(Boolean))] as string[],
    [tags],
  );
  const [dept, setDept] = useState("all");

  const filtered = useMemo(() => {
    let r = tags.filter((t) => {
      const mq =
        !q ||
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.tagCode.toLowerCase().includes(q.toLowerCase()) ||
        (t.assignee ?? "").includes(q);
      const mz = zone === "all" || t.lastDetectedZone === zone;
      const ms = status === "all" || t.status === status;
      const md = dept === "all" || t.department === dept;
      return mq && mz && ms && md;
    });
    r = [...r].sort((a, b) => {
      if (sort === "signal") return b.signalStrength - a.signalStrength;
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "importance") {
        const w = { high: 3, normal: 2, low: 1 };
        return (w[b.importance ?? "low"] ?? 0) - (w[a.importance ?? "low"] ?? 0);
      }
      return (
        new Date(b.lastDetectedAt).getTime() -
        new Date(a.lastDetectedAt).getTime()
      );
    });
    return r;
  }, [tags, q, zone, status, dept, sort]);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="기관 자산 목록"
        desc={`총 ${tags.length}개 자산 · 배터리 없는 태그로 추적`}
        icon={<Table2 className="size-5" />}
        action={
          <Button variant="mint" onClick={onAdd}>
            <Plus className="size-4" /> 새 자산 등록
          </Button>
        }
      />

      <Card className="space-y-3 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="자산명 · 태그 ID · 담당자 검색"
              className="pl-9"
            />
          </div>
          <Select value={dept} onChange={(e) => setDept(e.target.value)} className="lg:w-40">
            <option value="all">전체 부서</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>
          <Select value={zone} onChange={(e) => setZone(e.target.value)} className="lg:w-40">
            <option value="all">전체 구역</option>
            {zones.map((z) => (
              <option key={z.id} value={z.name}>{z.name}</option>
            ))}
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} className="lg:w-40">
            <option value="recent">최근 감지순</option>
            <option value="signal">신호순</option>
            <option value="importance">중요도순</option>
            <option value="name">이름순</option>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="size-3.5 text-muted" />
          {STATUS_FILTERS.map((s) => (
            <Chip key={s.key} active={status === s.key} onClick={() => setStatus(s.key)}>
              {s.label}
            </Chip>
          ))}
          <span className="ml-auto text-xs text-muted">{filtered.length}개 표시</span>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[920px] text-sm">
          <thead>
            <tr className="border-b border-border-soft text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">자산명</th>
              <th className="px-4 py-3 font-medium">카테고리</th>
              <th className="px-4 py-3 font-medium">부서/담당자</th>
              <th className="px-4 py-3 font-medium">추정 구역</th>
              <th className="px-4 py-3 font-medium">마지막 감지</th>
              <th className="px-4 py-3 font-medium">중요도</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 text-right font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.id}
                className="border-b border-border-soft/60 last:border-0 hover:bg-surface/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-mint">
                      <TagIcon icon={t.icon} className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium text-text">{t.name}</p>
                      <p className="font-mono text-[11px] text-muted">{t.tagCode}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{t.category}</td>
                <td className="px-4 py-3">
                  <p className="text-text">{t.department}</p>
                  <p className="text-[11px] text-muted">{t.assignee}</p>
                </td>
                <td className="px-4 py-3 text-muted">
                  <p className="text-text">{t.lastDetectedZone}</p>
                  <p className="text-[11px]">{t.lastDetectedHub}</p>
                </td>
                <td className="px-4 py-3 text-muted">{timeAgo(t.lastDetectedAt, state.now)}</td>
                <td className="px-4 py-3"><ImportanceBadge level={t.importance} /></td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Button variant="subtle" size="sm" onClick={() => onSearch(t)}>
                    <Crosshair className="size-3.5" /> 탐색
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted">
                  조건에 맞는 자산이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
