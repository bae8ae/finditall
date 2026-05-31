"use client";

import { Check, Home, Sparkles, Crown, Wifi } from "lucide-react";
import { Card, Button, SectionTitle } from "../ui/primitives";
import { useToast } from "../ui/toast";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter Rental",
    price: "₩6,900",
    period: "/월",
    icon: Wifi,
    desc: "1~2인 가구 입문용",
    included: ["FindIt Hub 2개 대여", "스티커 태그 20개 제공", "앱 기본 기능 포함"],
    features: ["물건 30개 등록", "기본 구역 탐색", "허브 상태 보기", "단일 사용자"],
    highlight: false,
  },
  {
    name: "Home Plus",
    price: "₩9,900",
    period: "/월",
    icon: Home,
    desc: "넓은 집 · 다인 가구",
    included: ["FindIt Hub 4개 대여", "스티커 태그 50개 제공", "교체·반납 지원"],
    features: [
      "물건 무제한 등록",
      "가족 공유",
      "위치 히스토리",
      "Guest Find",
      "우선 알림",
    ],
    highlight: true,
  },
  {
    name: "Family Max",
    price: "₩14,900",
    period: "/월",
    icon: Crown,
    desc: "가족·공동 생활 공간",
    included: ["FindIt Hub 6개 대여", "스티커 태그 100개 제공", "추가 태그 월 20개 교체"],
    features: ["가족 사용자 6명", "전 구역 커버리지", "장기 히스토리", "프리미엄 지원"],
    highlight: false,
  },
];

export function PersonalPricing() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <SectionTitle
        title="개인용 통합 구독"
        desc="앱 이용료와 FindIt Hub·스티커 태그 대여 비용을 하나의 월 구독으로 제공합니다."
        icon={<Sparkles className="size-5" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <Card
            key={p.name}
            className={cn(
              "relative flex flex-col",
              p.highlight && "border-mint/40 bg-gradient-to-br from-mint/10 to-surface/40 shadow-lg shadow-mint/10",
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
            <p className="mt-1 text-xs text-muted">앱 + 하드웨어 대여 포함</p>
            <div className="mt-4 rounded-xl border border-border-soft bg-surface-2/50 p-3">
              <p className="text-xs font-semibold text-text">대여 구성</p>
              <ul className="mt-2 space-y-2">
                {p.included.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-muted">
                    <Check className="size-4 text-mint" /> {it}
                  </li>
                ))}
              </ul>
            </div>
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
                  kind: "success",
                  title: `${p.name} 구독 신청`,
                  desc: "데모 — 앱 이용과 하드웨어 대여가 함께 활성화됩니다.",
                })
              }
            >
              구독 시작하기
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
