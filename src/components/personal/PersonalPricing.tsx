"use client";

import { Check, Package, Sparkles, Crown, Wifi, StickyNote } from "lucide-react";
import { Card, Button, SectionTitle } from "../ui/primitives";
import { useToast } from "../ui/toast";
import { cn } from "@/lib/utils";

const KITS = [
  {
    name: "Home Starter",
    price: "₩89,000",
    icon: Wifi,
    desc: "1~2인 가구 입문용",
    items: ["FindIt Hub 2개", "스티커 태그 20개", "기본 구역 탐색"],
    highlight: false,
  },
  {
    name: "Home Plus",
    price: "₩169,000",
    icon: Package,
    desc: "넓은 집 · 다인 가구",
    items: ["FindIt Hub 4개", "스티커 태그 50개", "전 구역 커버리지", "가족 공유 지원"],
    highlight: true,
  },
  {
    name: "Tag Pack",
    price: "₩39,000",
    icon: StickyNote,
    desc: "태그만 추가 구매",
    items: ["스티커 태그 30개 추가", "기존 허브와 호환", "다수 물건 관리"],
    highlight: false,
  },
];

const PLANS = [
  {
    name: "무료",
    price: "₩0",
    period: "",
    features: ["물건 10개 등록", "기본 구역 탐색", "허브 상태 보기", "단일 사용자"],
    cta: "현재 플랜",
    highlight: false,
  },
  {
    name: "Plus",
    price: "₩4,900",
    period: "/월",
    features: [
      "물건 무제한 등록",
      "가족 공유",
      "위치 히스토리",
      "Guest Find",
      "우선 알림",
    ],
    cta: "Plus 시작하기",
    highlight: true,
  },
];

export function PersonalPricing() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <SectionTitle
        title="요금제 & 스타터 킷"
        desc="배터리 없는 스티커 태그로 많은 물건을 얇고 저렴하게"
        icon={<Sparkles className="size-5" />}
      />

      {/* hardware kits */}
      <div>
        <p className="mb-3 text-sm font-semibold text-text">하드웨어 스타터 킷</p>
        <div className="grid gap-4 md:grid-cols-3">
          {KITS.map((k) => (
            <Card
              key={k.name}
              className={cn(
                "relative flex flex-col",
                k.highlight && "border-pink/40 shadow-lg shadow-pink/10",
              )}
            >
              {k.highlight && (
                <span className="absolute -top-2.5 left-5 rounded-full bg-gradient-to-r from-pink to-pink-soft px-3 py-0.5 text-[11px] font-bold text-white">
                  인기
                </span>
              )}
              <div className="mb-3 grid size-11 place-items-center rounded-xl bg-surface-2 text-pink-soft">
                <k.icon className="size-5" />
              </div>
              <p className="text-base font-bold text-text">{k.name}</p>
              <p className="text-xs text-muted">{k.desc}</p>
              <p className="mt-3 text-2xl font-extrabold text-text">{k.price}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {k.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-muted">
                    <Check className="size-4 text-mint" /> {it}
                  </li>
                ))}
              </ul>
              <Button
                variant={k.highlight ? "primary" : "outline"}
                className="mt-5 w-full"
                onClick={() =>
                  toast({ kind: "info", title: `${k.name} 구매 문의 접수`, desc: "데모 — 실제 결제는 발생하지 않습니다." })
                }
              >
                구매하기
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* app subscription */}
      <div>
        <p className="mb-3 text-sm font-semibold text-text">앱 구독</p>
        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.map((p) => (
            <Card
              key={p.name}
              className={cn(
                "relative flex flex-col",
                p.highlight && "border-mint/40 bg-gradient-to-br from-mint/10 to-surface/40",
              )}
            >
              <div className="flex items-center gap-2">
                {p.highlight && <Crown className="size-5 text-mint" />}
                <p className="text-base font-bold text-text">{p.name}</p>
              </div>
              <p className="mt-2">
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
                disabled={!p.highlight}
                className="mt-5 w-full"
                onClick={() =>
                  toast({ kind: "success", title: "Plus 플랜 활성화", desc: "데모 — 모든 기능이 잠금 해제됩니다." })
                }
              >
                {p.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
