"use client";

import { useMemo, useState } from "react";
import { Filter, Plus, Search, UserRound, Users } from "lucide-react";
import { Button, Card, Chip, Input, SectionTitle, Select } from "../ui/primitives";
import { useStore, useTags, useZones } from "@/lib/store";
import { timeAgo } from "@/lib/utils";
import type { TagStatus } from "@/lib/types";

const STATUS_FILTERS: { key: TagStatus | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "normal", label: "정상" },
  { key: "searching", label: "확인 중" },
  { key: "lowSignal", label: "확인 필요" },
  { key: "missing", label: "연결 확인" },
];

function userStatus(status: TagStatus) {
  if (status === "missing") {
    return { label: "연결 확인", cls: "border-danger/30 bg-danger/10 text-danger" };
  }
  if (status === "lowSignal") {
    return { label: "확인 필요", cls: "border-warn/30 bg-warn/10 text-warn" };
  }
  if (status === "searching") {
    return { label: "확인 중", cls: "border-info/30 bg-info/10 text-info" };
  }
  return { label: "정상", cls: "border-mint/30 bg-mint/10 text-mint" };
}

export function AssetTable({ onAdd }: { onAdd: () => void }) {
  const users = useTags("organization");
  const zones = useZones("organization");
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [zone, setZone] = useState("all");
  const [status, setStatus] = useState<TagStatus | "all">("all");
  const [team, setTeam] = useState("all");

  const teams = useMemo(
    () => [...new Set(users.map((user) => user.department).filter(Boolean))] as string[],
    [users],
  );

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        const matchQuery =
          !q ||
          user.name.includes(q) ||
          (user.assignee ?? "").includes(q) ||
          user.tagCode.toLowerCase().includes(q.toLowerCase());
        const matchZone = zone === "all" || user.lastDetectedZone === zone;
        const matchStatus = status === "all" || user.status === status;
        const matchTeam = team === "all" || user.department === team;
        return matchQuery && matchZone && matchStatus && matchTeam;
      }),
    [users, q, zone, status, team],
  );

  return (
    <div className="space-y-4">
      <SectionTitle
        title="이용자 관리"
        desc={`등록 이용자 ${users.length}명 · 생활 신호, 복약·필수 물품, 담당자 배정 상태`}
        icon={<Users className="size-5" />}
        action={
          <Button variant="mint" onClick={onAdd}>
            <Plus className="size-4" /> 이용자 등록
          </Button>
        }
      />

      <Card className="space-y-3 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="이용자 이름 · 관리 ID · 담당자 검색"
              className="pl-9"
            />
          </div>
          <Select
            value={team}
            onChange={(event) => setTeam(event.target.value)}
            className="lg:w-40"
          >
            <option value="all">전체 담당팀</option>
            {teams.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select
            value={zone}
            onChange={(event) => setZone(event.target.value)}
            className="lg:w-40"
          >
            <option value="all">전체 구역</option>
            {zones.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="size-3.5 text-muted" />
          {STATUS_FILTERS.map((filter) => (
            <Chip
              key={filter.key}
              active={status === filter.key}
              onClick={() => setStatus(filter.key)}
            >
              {filter.label}
            </Chip>
          ))}
          <span className="ml-auto text-xs text-muted">{filtered.length}명 표시</span>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-border-soft text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">이용자</th>
              <th className="px-4 py-3 font-medium">담당팀/담당자</th>
              <th className="px-4 py-3 font-medium">현재 구역</th>
              <th className="px-4 py-3 font-medium">마지막 활동</th>
              <th className="px-4 py-3 font-medium">관리 메모</th>
              <th className="px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const statusInfo = userStatus(user.status);
              return (
                <tr
                  key={user.id}
                  className="border-b border-border-soft/60 last:border-0 hover:bg-surface/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-full bg-mint/12 text-mint">
                        <UserRound className="size-4" />
                      </span>
                      <div>
                        <p className="font-medium text-text">{user.name}</p>
                        <p className="font-mono text-[11px] text-muted">{user.tagCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-text">{user.department}</p>
                    <p className="text-[11px] text-muted">{user.assignee}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-text">{user.lastDetectedZone}</p>
                    <p className="text-[11px] text-muted">{user.lastDetectedHub}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {timeAgo(user.lastDetectedAt, state.now)}
                  </td>
                  <td className="max-w-60 px-4 py-3 text-xs text-muted">
                    {user.notes}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusInfo.cls}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">
                  조건에 맞는 이용자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
