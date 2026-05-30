"use client";

import { Check, Building2, Users, Rocket, Crown } from "lucide-react";
import { Card, Button, SectionTitle } from "../ui/primitives";
import { useToast } from "../ui/toast";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Small Team",
    price: "₩290,000",
    period: "/월",
    icon: Users,
    desc: "소규모 시설 · 단일 층",
    features: ["허브 5개", "태그 100개", "관리자 3명", "기본 자산 탐색", "구역별 맵"],
    highlight: false,
  },
  {
    name: "Facility Pro",
    price: "₩1,290,000",
    period: "/월",
    icon: Rocket,
    desc: "병원·연구소 등 다층 시설",
    features: [
      "허브 20개",
      "태그 1,000개",
      "권한 관리 (RBAC)",
      "운영 리포트 · 분석",
      "반출/이탈 지오펜스 알림",
      "우선 기술 지원",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "맞춤 견적",
    period: "",
    icon: Crown,
    desc: "대규모·다중 사이트",
    features: ["맞춤 설치", "무제한 허브·태그", "API 연동", "SSO / 감사 로그", "전담 매니저 지원", "SLA 보장"],
    highlight: false,
  },
];

export function OrganizationPricing() {
  const toast = useToast();
  return (
    <div className="space-y-5">
      <SectionTitle
        title="기관용 SaaS 플랜"
        desc="실내 자산을 얇고 저렴한 배터리 없는 태그로 대규모 관리"
        icon={<Building2 className="size-5" />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <Card
            key={p.name}
            className={cn(
              "relative flex flex-col",
              p.highlight && "border-mint/50 bg-gradient-to-br from-mint/10 to-surface/40 shadow-lg shadow-mint/10",
            )}
          >
            {p.highlight && (
              <span className="absolute -top-2.5 left-5 rounded-full bg-gradient-to-r from-mint to-mint-soft px-3 py-0.5 text-[11px] font-bold text-[#04221c]">
                추천
              </span>
            )}
            <div className="mb-3 grid size-11 place-items-center rounded-xl bg-surface-2 text-mint">
              <p.icon className="size-5" />
            </div>
            <p className="text-base font-bold text-text">{p.name}</p>
            <p className="text-xs text-muted">{p.desc}</p>
            <p className="mt-3">
              <span className="text-2xl font-extrabold text-text">{p.price}</span>
              <span className="text-sm text-muted">{p.period}</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted">
                  <Check className="size-4 text-mint" /> {f}
                </li>
              ))}
            </ul>
            <Button
              variant={p.highlight ? "mint" : "outline"}
              className="mt-5 w-full"
              onClick={() =>
                toast({
                  kind: "info",
                  title: `${p.name} 도입 문의 접수`,
                  desc: "데모 — 영업팀이 곧 연락드립니다.",
                })
              }
            >
              {p.name === "Enterprise" ? "도입 상담" : "시작하기"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
