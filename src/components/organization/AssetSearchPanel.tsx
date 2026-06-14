"use client";

import { useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  Filter,
  MapPin,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Button, Card, Chip, Input, SectionTitle } from "../ui/primitives";
import { organizationCareEvents } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { cn, formatTime, timeAgo } from "@/lib/utils";
import { useToast } from "../ui/toast";

const FILTERS = ["전체", "확인 필요", "복약", "무반응", "외출·귀가", "허브"];
const STATUS = {
  new: "확인 필요",
  checking: "확인 중",
  confirmed: "확인됨",
  resolved: "조치 완료",
};
const SEVERITY = {
  info: "border-info/25 bg-info/5 text-info",
  normal: "border-mint/25 bg-mint/5 text-mint",
  warning: "border-warn/30 bg-warn/5 text-warn",
  critical: "border-danger/30 bg-danger/5 text-danger",
};

export function AssetSearchPanel() {
  const { state } = useStore();
  const toast = useToast();
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const events = organizationCareEvents(state.now);

  const filtered = useMemo(
    () =>
      events.filter((event) => {
        const matchesQuery =
          !query ||
          (event.personName ?? "").includes(query) ||
          event.location.includes(query) ||
          event.type.includes(query);
        const matchesFilter =
          filter === "전체" ||
          (filter === "확인 필요" &&
            (event.status === "new" || event.status === "checking")) ||
          (filter === "복약" && event.type.includes("복약")) ||
          (filter === "무반응" && event.type === "장시간 무반응") ||
          (filter === "외출·귀가" &&
            ["외출 감지", "귀가 감지", "보호자 확인 요청"].includes(event.type)) ||
          (filter === "허브" && event.type === "허브 오프라인");
        return matchesQuery && matchesFilter;
      }),
    [events, filter, query],
  );

  function confirmEvent(id: string, title: string) {
    setConfirmed((current) => [...new Set([...current, id])]);
    toast({
      kind: "success",
      title: "담당자 확인 완료",
      desc: `${title} 이벤트가 확인 처리되었습니다.`,
    });
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        title="이벤트 관제"
        desc="생활 안전 이벤트의 심각도, 보호자 알림, 담당자 확인 상태를 관리합니다."
        icon={<ShieldAlert className="size-5" />}
      />

      <Card className="space-y-3 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="이용자, 구역 또는 이벤트 검색"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="size-3.5 text-muted" />
          {FILTERS.map((item) => (
            <Chip key={item} active={filter === item} onClick={() => setFilter(item)}>
              {item}
            </Chip>
          ))}
          <span className="ml-auto text-xs text-muted">{filtered.length}건</span>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((event) => {
          const isConfirmed = confirmed.includes(event.id);
          return (
            <Card
              key={event.id}
              className={cn(
                "grid gap-4 p-4 lg:grid-cols-[100px_1.1fr_1fr_120px_130px] lg:items-center",
                event.severity === "critical" && "border-danger/30",
              )}
            >
              <div>
                <p className="font-mono text-sm font-semibold text-text">
                  {formatTime(event.timestamp)}
                </p>
                <p className="text-[10px] text-muted">
                  {timeAgo(event.timestamp, state.now)}
                </p>
              </div>

              <div>
                <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold", SEVERITY[event.severity])}>
                  {event.type}
                </span>
                <p className="mt-2 text-sm font-semibold text-text">
                  {event.personName ?? "BOMI Hub"}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-1 text-xs font-medium text-text">
                  <MapPin className="size-3 text-mint" /> {event.location}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {event.description}
                </p>
              </div>

              <div className="text-xs">
                <p className="text-muted">보호자 알림</p>
                <p className="mt-1 font-medium text-text">
                  {event.guardianNotified ? "전송됨" : "없음"}
                </p>
              </div>

              <div>
                {isConfirmed || event.status === "resolved" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-mint/10 px-3 py-2 text-xs font-semibold text-mint">
                    <CheckCircle2 className="size-3.5" /> 확인 완료
                  </span>
                ) : event.status === "confirmed" ? (
                  <span className="text-xs font-medium text-muted">
                    {STATUS[event.status]}
                  </span>
                ) : (
                  <Button
                    variant={event.severity === "critical" ? "danger" : "outline"}
                    size="sm"
                    onClick={() =>
                      confirmEvent(event.id, event.personName ?? event.location)
                    }
                  >
                    <BellRing className="size-3.5" /> 담당자 확인
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
