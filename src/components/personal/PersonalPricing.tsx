"use client";

import { Check, Crown, HeartPulse, Home, Sparkles } from "lucide-react";
import { Button, Card, SectionTitle } from "../ui/primitives";
import { useToast } from "../ui/toast";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Care Basic",
    price: "₩9,900",
    period: "/월",
    icon: Home,
    desc: "혼자 사는 부모님을 위한 기본 안심 플랜",
    features: [
      "BOMI Hub 1개 대여",
      "필수 RFID 태그 5개 제공",
      "활동 감지",
      "장시간 무반응 알림",
      "보호자 1명 연결",
      "최근 이벤트 7일 보관",
    ],
    highlight: false,
  },
  {
    name: "Care Plus",
    price: "₩19,900",
    period: "/월",
    icon: HeartPulse,
    desc: "복약과 생활 패턴까지 함께 확인하는 추천 플랜",
    features: [
      "BOMI Hub 2개 대여",
      "RFID 태그 15개 제공",
      "복약 확인",
      "외출/귀가 이벤트",
      "보호자 3명 연결",
      "활동 추세 리포트",
      "최근 이벤트 30일 보관",
      "우선 알림",
    ],
    highlight: true,
  },
  {
    name: "Family Max",
    price: "₩29,900",
    period: "/월",
    icon: Crown,
    desc: "여러 공간과 가족 보호자를 위한 확장 플랜",
    features: [
      "BOMI Hub 4개 대여",
      "RFID 태그 30개 제공",
      "가족 보호자 6명 연결",
      "장기 활동 리포트",
      "낙상 의심 패턴 알림",
      "전화 확인 버튼",
      "프리미엄 지원",
    ],
    highlight: false,
  },
];

export function PersonalPricing() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <SectionTitle
        title="BOMI Family 요금제"
        desc="앱 이용료, BOMI Hub 대여, RFID 태그, 보호자 알림 기능을 하나의 월 구독으로 제공합니다."
        icon={<Sparkles className="size-5" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative flex flex-col",
              plan.highlight &&
                "border-mint/40 bg-gradient-to-br from-mint/10 to-surface/40 shadow-lg shadow-mint/10",
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
                  kind: "success",
                  title: `${plan.name} 구독 신청`,
                  desc: "BOMI Family 데모 신청이 접수되었습니다.",
                })
              }
            >
              구독 시작하기
            </Button>
          </Card>
        ))}
      </div>

      <p className="rounded-xl border border-border-soft bg-surface/30 p-4 text-center text-xs leading-relaxed text-muted">
        BOMI Care는 의료 진단 기기가 아니며, 생활 안전 이벤트를 보호자에게
        전달하는 보조 서비스입니다.
      </p>
    </div>
  );
}
