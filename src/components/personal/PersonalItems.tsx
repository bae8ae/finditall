"use client";

import { useMemo, useState } from "react";
import {
  Search, Plus, LayoutGrid, List, Eye, Crosshair,
} from "lucide-react";
import { Card, Button, Input, Select, SectionTitle, Chip, Modal } from "../ui/primitives";
import { StatusBadge } from "../StatusBadge";
import { SignalBar } from "../SignalGauge";
import { TagIcon } from "../TagIcon";
import { useTags, useStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";
import { personalCategories } from "@/lib/mock-data";
import type { Tag, TagStatus } from "@/lib/types";

const STATUS_FILTERS: { key: TagStatus | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "normal", label: "정상" },
  { key: "lowSignal", label: "신호 약함" },
  { key: "missing", label: "미감지" },
];

export function PersonalItems({
  onFind,
  onAdd,
}: {
  onFind: (t: Tag) => void;
  onAdd: () => void;
}) {
  const tags = useTags("personal");
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState<TagStatus | "all">("all");
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [detail, setDetail] = useState<Tag | null>(null);

  const filtered = useMemo(() => {
    let r = tags.filter((t) => {
      const matchQ =
        !q ||
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.tagCode.toLowerCase().includes(q.toLowerCase());
      const matchCat = cat === "all" || t.category === cat;
      const matchStatus = status === "all" || t.status === status;
      return matchQ && matchCat && matchStatus;
    });
    r = [...r].sort((a, b) => {
      if (sort === "signal") return b.signalStrength - a.signalStrength;
      if (sort === "name") return a.name.localeCompare(b.name);
      return (
        new Date(b.lastDetectedAt).getTime() -
        new Date(a.lastDetectedAt).getTime()
      );
    });
    return r;
  }, [tags, q, cat, status, sort]);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="내 물건 목록"
        desc={`총 ${tags.length}개 · 배터리 없는 스티커 태그로 관리 중`}
        icon={<LayoutGrid className="size-5" />}
        action={
          <Button variant="primary" onClick={onAdd}>
            <Plus className="size-4" /> 새 스티커 태그 등록
          </Button>
        }
      />

      {/* controls */}
      <Card className="space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="물건 이름 또는 태그 ID 검색"
              className="pl-9"
            />
          </div>
          <Select value={cat} onChange={(e) => setCat(e.target.value)} className="sm:w-44">
            <option value="all">전체 카테고리</option>
            {personalCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-40">
            <option value="recent">최근 감지순</option>
            <option value="signal">신호 강한순</option>
            <option value="name">이름순</option>
          </Select>
          <div className="flex gap-1 rounded-lg border border-border bg-surface/40 p-1">
            <button
              onClick={() => setView("grid")}
              className={`grid size-8 place-items-center rounded-md ${view === "grid" ? "bg-surface-2 text-mint" : "text-muted"}`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`grid size-8 place-items-center rounded-md ${view === "table" ? "bg-surface-2 text-mint" : "text-muted"}`}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <Chip
              key={s.key}
              active={status === s.key}
              onClick={() => setStatus(s.key)}
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </Card>

      {filtered.length === 0 && (
        <Card className="py-12 text-center text-sm text-muted">
          조건에 맞는 물건이 없습니다.
        </Card>
      )}

      {/* grid view */}
      {view === "grid" && filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Card key={t.id} className="fit-fade flex flex-col gap-3 p-4">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-pink-soft">
                  <TagIcon icon={t.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-text">{t.name}</p>
                  <p className="font-mono text-[11px] text-muted">{t.tagCode}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted">
                <span>📂 {t.category}</span>
                <span>📍 {t.lastDetectedZone}</span>
                <span className="col-span-2">
                  🕑 {timeAgo(t.lastDetectedAt, state.now)} · {t.lastDetectedHub}
                </span>
              </div>
              <SignalBar value={t.signalStrength} />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => onFind(t)}
                >
                  <Crosshair className="size-3.5" /> 찾기
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDetail(t)}>
                  <Eye className="size-3.5" /> 상세
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* table view */}
      {view === "table" && filtered.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs text-muted">
                <th className="px-4 py-3 font-medium">물건</th>
                <th className="px-4 py-3 font-medium">카테고리</th>
                <th className="px-4 py-3 font-medium">마지막 감지</th>
                <th className="px-4 py-3 font-medium">신호</th>
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
                      <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-pink-soft">
                        <TagIcon icon={t.icon} className="size-4" />
                      </span>
                      <div>
                        <p className="font-medium text-text">{t.name}</p>
                        <p className="font-mono text-[11px] text-muted">{t.tagCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{t.category}</td>
                  <td className="px-4 py-3 text-muted">
                    <p className="text-text">{t.lastDetectedZone}</p>
                    <p className="text-[11px]">{timeAgo(t.lastDetectedAt, state.now)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-28">
                      <SignalBar value={t.signalStrength} showLabel={false} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="subtle" size="sm" onClick={() => onFind(t)}>
                        찾기
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDetail(t)}>
                        상세
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* detail modal */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.name ?? ""}
        desc={detail ? `${detail.tagCode} · ${detail.category}` : ""}
        footer={
          detail && (
            <>
              <Button variant="ghost" onClick={() => setDetail(null)}>
                닫기
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const d = detail;
                  setDetail(null);
                  onFind(d);
                }}
              >
                <Crosshair className="size-4" /> 찾기 모드 열기
              </Button>
            </>
          )
        }
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-pink-soft">
                <TagIcon icon={detail.icon} className="size-7" />
              </span>
              <div>
                <StatusBadge status={detail.status} />
                <p className="mt-1 text-xs text-muted">
                  배터리 타입: {detail.batteryType}
                </p>
              </div>
            </div>
            <SignalBar value={detail.signalStrength} />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="마지막 감지 구역" value={detail.lastDetectedZone} />
              <Detail label="마지막 감지 허브" value={detail.lastDetectedHub} />
              <Detail
                label="마지막 감지 시간"
                value={timeAgo(detail.lastDetectedAt, state.now)}
              />
              <Detail label="카테고리" value={detail.category} />
            </div>
            {detail.notes && (
              <div className="rounded-xl border border-border-soft bg-surface/40 p-3 text-sm text-muted">
                📝 {detail.notes}
              </div>
            )}
            <p className="text-[11px] text-muted">
              ※ 정확한 좌표가 아닌 허브 신호 강도 기반의 구역 단위 위치 추정입니다.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface/40 p-3">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-0.5 font-medium text-text">{value}</p>
    </div>
  );
}
