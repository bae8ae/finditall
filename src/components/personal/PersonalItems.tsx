"use client";

import { useMemo, useState } from "react";
import {
  BellRing,
  Crosshair,
  Eye,
  LayoutGrid,
  List,
  Package,
  Pill,
  Plus,
  Search,
} from "lucide-react";
import {
  Button,
  Card,
  Chip,
  Input,
  Modal,
  SectionTitle,
  Select,
} from "../ui/primitives";
import { SignalBar } from "../SignalGauge";
import { TagIcon } from "../TagIcon";
import { useStore, useTags } from "@/lib/store";
import { personalCategories } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import { useToast } from "../ui/toast";
import type { Tag, TagStatus } from "@/lib/types";

const STATUS_FILTERS: { key: TagStatus | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "normal", label: "정상·확인" },
  { key: "searching", label: "이동 감지" },
  { key: "lowSignal", label: "미확인" },
  { key: "missing", label: "장기 미감지" },
];

function careStatus(tag: Tag) {
  if (tag.status === "missing") {
    return { label: "장기 미감지", cls: "border-danger/30 bg-danger/10 text-danger" };
  }
  if (tag.status === "lowSignal") {
    return {
      label: tag.category === "약통" ? "미확인" : "위치 확인 필요",
      cls: "border-warn/30 bg-warn/10 text-warn",
    };
  }
  if (tag.status === "searching") {
    return { label: "위치 변화 감지", cls: "border-info/30 bg-info/10 text-info" };
  }
  if (tag.category === "약통") {
    return { label: "복용 확인", cls: "border-mint/30 bg-mint/10 text-mint" };
  }
  return { label: "정상", cls: "border-mint/30 bg-mint/10 text-mint" };
}

function actionLabel(tag: Tag) {
  if (tag.status === "missing") return "알림 보내기";
  if (tag.category === "약통") return "복약 확인";
  return "위치 확인";
}

export function PersonalItems({
  onFind,
  onAdd,
}: {
  onFind: (tag: Tag) => void;
  onAdd: () => void;
}) {
  const tags = useTags("personal");
  const { state, updateTag, addNotification } = useStore();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState<TagStatus | "all">("all");
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [detail, setDetail] = useState<Tag | null>(null);

  const filtered = useMemo(() => {
    const result = tags.filter((tag) => {
      const matchQuery =
        !q ||
        tag.name.toLowerCase().includes(q.toLowerCase()) ||
        tag.tagCode.toLowerCase().includes(q.toLowerCase());
      const matchCategory = cat === "all" || tag.category === cat;
      const matchStatus = status === "all" || tag.status === status;
      return matchQuery && matchCategory && matchStatus;
    });

    return [...result].sort((a, b) => {
      if (sort === "signal") return b.signalStrength - a.signalStrength;
      if (sort === "name") return a.name.localeCompare(b.name);
      return (
        new Date(b.lastDetectedAt).getTime() -
        new Date(a.lastDetectedAt).getTime()
      );
    });
  }, [tags, q, cat, status, sort]);

  function runAction(tag: Tag) {
    if (tag.status === "missing") {
      addNotification({
        ownerType: "personal",
        kind: "warn",
        title: "보호자 확인 요청",
        body: `${tag.name}의 장기 미감지 상태를 확인해주세요.`,
      });
      toast({
        kind: "info",
        title: "보호자 알림 전송",
        desc: `${tag.name} 확인 요청`,
      });
      return;
    }

    if (tag.category === "약통") {
      updateTag(tag.id, {
        status: "normal",
        lastDetectedAt: new Date().toISOString(),
      });
      addNotification({
        ownerType: "personal",
        kind: "ok",
        title: "복약 확인",
        body: `${tag.name} 사용이 확인되었습니다.`,
      });
      toast({ kind: "success", title: "복약 확인 완료", desc: tag.name });
      return;
    }

    onFind(tag);
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        title="복약·필수 물품"
        desc={`총 ${tags.length}개 · 배터리 없는 RFID 태그로 사용 여부와 위치 변화를 확인합니다.`}
        icon={<Package className="size-5" />}
        action={
          <Button variant="primary" onClick={onAdd}>
            <Plus className="size-4" /> RFID 태그 등록
          </Button>
        }
      />

      <Card className="space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="약통 또는 필수 물품 검색"
              className="pl-9"
            />
          </div>
          <Select
            value={cat}
            onChange={(event) => setCat(event.target.value)}
            className="sm:w-44"
          >
            <option value="all">전체 카테고리</option>
            {personalCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="sm:w-40"
          >
            <option value="recent">최근 감지순</option>
            <option value="signal">신호 강한순</option>
            <option value="name">이름순</option>
          </Select>
          <div className="flex gap-1 rounded-lg border border-border bg-surface/40 p-1">
            <button
              onClick={() => setView("grid")}
              className={`grid size-8 place-items-center rounded-md ${view === "grid" ? "bg-surface-2 text-mint" : "text-muted"}`}
              aria-label="카드 보기"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`grid size-8 place-items-center rounded-md ${view === "table" ? "bg-surface-2 text-mint" : "text-muted"}`}
              aria-label="목록 보기"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <Chip
              key={filter.key}
              active={status === filter.key}
              onClick={() => setStatus(filter.key)}
            >
              {filter.label}
            </Chip>
          ))}
        </div>
      </Card>

      {filtered.length === 0 && (
        <Card className="py-12 text-center text-sm text-muted">
          조건에 맞는 복약·필수 물품이 없습니다.
        </Card>
      )}

      {view === "grid" && filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tag) => {
            const statusInfo = careStatus(tag);
            return (
              <Card key={tag.id} className="fit-fade flex flex-col gap-3 p-4">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-pink-soft">
                    <TagIcon icon={tag.icon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-text">{tag.name}</p>
                    <p className="font-mono text-[11px] text-muted">{tag.tagCode}</p>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusInfo.cls}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-muted">
                  <span>{tag.category}</span>
                  <span>{tag.lastDetectedZone}</span>
                  <span className="col-span-2">
                    {timeAgo(tag.lastDetectedAt, state.now)} · {tag.lastDetectedHub}
                  </span>
                </div>
                <SignalBar value={tag.signalStrength} />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => runAction(tag)}
                  >
                    {tag.category === "약통" ? (
                      <Pill className="size-3.5" />
                    ) : tag.status === "missing" ? (
                      <BellRing className="size-3.5" />
                    ) : (
                      <Crosshair className="size-3.5" />
                    )}
                    {actionLabel(tag)}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDetail(tag)}>
                    <Eye className="size-3.5" /> 상세
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {view === "table" && filtered.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs text-muted">
                <th className="px-4 py-3 font-medium">복약·물품</th>
                <th className="px-4 py-3 font-medium">용도</th>
                <th className="px-4 py-3 font-medium">마지막 감지</th>
                <th className="px-4 py-3 font-medium">신호</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 text-right font-medium">작업</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tag) => {
                const statusInfo = careStatus(tag);
                return (
                  <tr
                    key={tag.id}
                    className="border-b border-border-soft/60 last:border-0 hover:bg-surface/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-pink-soft">
                          <TagIcon icon={tag.icon} className="size-4" />
                        </span>
                        <div>
                          <p className="font-medium text-text">{tag.name}</p>
                          <p className="font-mono text-[11px] text-muted">{tag.tagCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{tag.category}</td>
                    <td className="px-4 py-3 text-muted">
                      <p className="text-text">{tag.lastDetectedZone}</p>
                      <p className="text-[11px]">{timeAgo(tag.lastDetectedAt, state.now)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-28">
                        <SignalBar value={tag.signalStrength} showLabel={false} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="subtle" size="sm" onClick={() => runAction(tag)}>
                        {actionLabel(tag)}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

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
                  runAction(detail);
                  setDetail(null);
                }}
              >
                {actionLabel(detail)}
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
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${careStatus(detail).cls}`}>
                  {careStatus(detail).label}
                </span>
                <p className="mt-2 text-xs text-muted">
                  배터리 없는 RFID 태그
                </p>
              </div>
            </div>
            <SignalBar value={detail.signalStrength} />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="마지막 감지 구역" value={detail.lastDetectedZone} />
              <Detail label="감지 허브" value={detail.lastDetectedHub} />
              <Detail label="마지막 감지" value={timeAgo(detail.lastDetectedAt, state.now)} />
              <Detail label="관리 용도" value={detail.category} />
            </div>
            {detail.notes && (
              <div className="rounded-xl border border-border-soft bg-surface/40 p-3 text-sm text-muted">
                {detail.notes}
              </div>
            )}
            <p className="text-[11px] leading-relaxed text-muted">
              정확한 좌표 추적이 아니라 BOMI Hub가 감지한 구역과 위치 변화를
              안내합니다.
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
