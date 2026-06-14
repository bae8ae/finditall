"use client";

import { Building2, Check, Crown, Rocket, Users } from "lucide-react";
import { Button, Card, SectionTitle } from "../ui/primitives";
import { useToast } from "../ui/toast";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Facility Starter",
    price: "₩390,000",
    period: "/월",
    icon: Users,
    desc: "소규모 돌봄 공간을 위한 시작 플랜",
    features: [
      "BOMI Hub 5개",
      "이용자 20명",
      "RFID 태그 100개",
      "기본 이벤트 관제",
      "관리자 3명",
      "월간 리포트",
    ],
    highlight: false,
  },
  {
    name: "Facility Pro",
    price: "₩1,490,000",
    period: "/월",
    icon: Rocket,
    desc: "복지관·요양시설을 위한 추천 플랜",
    features: [
      "BOMI Hub 25개",
      "이용자 150명",
      "RFID 태그 1,000개",
      "구역별 이벤트 관제",
      "권한 관리",
      "담당자별 알림 분배",
      "리포트/분석 대시보드",
      "우선 기술 지원",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "맞춤 견적",
    period: "",
    icon: Crown,
    desc: "대규모 기관·지자체·다중 사이트 도입",
    features: [
      "무제한 허브/태그 협의",
      "API 연동",
      "SSO / 감사 로그",
      "전담 매니저",
      "SLA",
      "기관 맞춤 리포트",
      "현장 설치 컨설팅",
    ],
    highlight: false,
  },
];

export function OrganizationPricing() {
  const toast = useToast();

  return (
    <div className="space-y-5">
      <SectionTitle
        title="BOMI Facility 요금제"
        desc="복지관, 요양시설, 방문돌봄 기관이 여러 이용자의 생활 안전 이벤트를 통합 관리할 수 있도록 제공합니다."
        icon={<Building2 className="size-5" />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative flex flex-col",
              plan.highlight &&
                "border-mint/50 bg-gradient-to-br from-mint/10 to-surface/40 shadow-lg shadow-mint/10",
            )}
          >
            {plan.highlight && (
              <span className="absolute -top-2.5 left-5 rounded-full bg-gradient-to-r from-mint to-mint-soft px-3 py-0.5 text-[11px] font-bold text-[#10130f]">
                추천 플랜
              </span>
            )}
            <div className="mb-3 grid size-11 place-items-center rounded-xl bg-surface-2 text-mint">
              <plan.icon className="size-5" />
            </div>
            <p className="text-base font-bold text-text">{plan.name}</p>
            <p className="mt-1 min-h-10 text-xs leading-relaxed text-muted">
              {plan.desc}
            </p>
            <p className="mt-3">
              <span className="text-2xl font-extrabold text-text">{plan.price}</span>
              <span className="text-sm text-muted">{plan.period}</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-mint" /> {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.highlight ? "mint" : "outline"}
              className="mt-6 w-full"
              onClick={() =>
                toast({
                  kind: "info",
                  title: `${plan.name} 도입 문의 접수`,
                  desc: "BOMI Facility 데모 상담이 접수되었습니다.",
                })
              }
            >
              {plan.name === "Enterprise" ? "도입 상담" : "시작하기"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
