"use client";

import {
  StickyNote, Wifi, Smartphone, BatteryCharging, Layers,
  Boxes, MapPin, ArrowRight, Home, Building2, Check, Sparkles,
} from "lucide-react";
import type { Mode } from "./Header";
import { Logo } from "./Header";

function Step({
  n,
  icon,
  title,
  desc,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="glass relative rounded-2xl border border-border-soft p-6">
      <span className="absolute right-5 top-4 text-5xl font-black text-surface-2">
        {n}
      </span>
      <div className="mb-4 grid size-12 place-items-center rounded-xl bg-gradient-to-br from-pink/20 to-mint/15 text-mint">
        {icon}
      </div>
      <h3 className="text-base font-bold text-text">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

function Diff({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-border-soft bg-surface/40 p-4">
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mint/15 text-mint">
        <Check className="size-4" />
      </span>
      <div>
        <p className="text-sm font-semibold text-text">{title}</p>
        <p className="mt-0.5 text-xs text-muted">{desc}</p>
      </div>
    </div>
  );
}

export function LandingHero({ setMode }: { setMode: (m: Mode) => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      {/* HERO */}
      <section className="relative overflow-hidden pt-14 pb-12 text-center sm:pt-20">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/50 px-4 py-1.5 text-xs font-medium text-muted fit-fade">
          <Sparkles className="size-3.5 text-mint" />
          배터리 없는 스티커 태그 · 허브 기반 실내 위치 추정
        </div>
        <h1 className="fit-fade mx-auto max-w-4xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl">
          배터리 없는 스티커 태그로,
          <br />
          <span className="gradient-text">필요한 물건을 언제나 찾다.</span>
        </h1>
        <p className="fit-fade mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">
          FindIt Hub가 태그의 고유 ID를 감지하고, 앱이 위치를 안내합니다.
          <br className="hidden sm:block" />
          정확한 GPS가 아니라 <span className="text-text">구역 단위 탐색</span>으로
          많은 물건을 얇고 저렴하게 관리하세요.
        </p>

        {/* mode select cards */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <button
            onClick={() => setMode("personal")}
            className="group glass relative overflow-hidden rounded-2xl border border-border-soft p-6 text-left transition hover:border-pink/40"
          >
            <div className="mb-4 grid size-12 place-items-center rounded-xl bg-pink/15 text-pink-soft">
              <Home className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-text">개인 사용자</h3>
            <p className="mt-1 text-sm text-muted">
              집 안에서 지갑·열쇠·리모컨·안경·스마트폰을 빠르게 찾기
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pink-soft">
              개인용 시작하기 <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </button>

          <button
            onClick={() => setMode("organization")}
            className="group glass relative overflow-hidden rounded-2xl border border-border-soft p-6 text-left transition hover:border-mint/40"
          >
            <div className="mb-4 grid size-12 place-items-center rounded-xl bg-mint/15 text-mint">
              <Building2 className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-text">기관 사용자</h3>
            <p className="mt-1 text-sm text-muted">
              병원·연구실·호텔·학교·공유오피스의 공용 자산 통합 관리
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mint">
              기관용 데모 보기 <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="pt-10">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-mint">
          How it works
        </p>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          작동 방식 3단계
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Step
            n={1}
            icon={<StickyNote className="size-6" />}
            title="물건에 스티커 태그 부착"
            desc="초박형·배터리 없는 스티커 태그를 물건에 붙입니다. 각 태그는 고유 ID를 가집니다."
          />
          <Step
            n={2}
            icon={<Wifi className="size-6" />}
            title="공간에 FindIt Hub 설치"
            desc="거실·현관·병동·연구실 등에 허브를 설치하면 주변 태그를 자동으로 감지합니다."
          />
          <Step
            n={3}
            icon={<Smartphone className="size-6" />}
            title="앱에서 위치와 신호 강도 확인"
            desc="가장 강하게 감지된 허브를 기준으로 구역 단위 위치와 근접 신호를 보여줍니다."
          />
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="mt-16 grid items-center gap-8 rounded-3xl border border-border-soft bg-surface/30 p-6 sm:p-10 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-pink-soft">
            AirTag류와의 차별점
          </p>
          <h2 className="text-2xl font-bold leading-snug sm:text-3xl">
            AirTag가 비싼 물건 몇 개를 추적한다면,
            <br />
            <span className="gradient-text">FindIt All은 많은 물건을 얇고 저렴하게.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            개별 GPS·배터리 태그 대신, 고유 ID 기반의 배터리 없는 스티커 태그와
            허브 네트워크로 실내 자산을 구역 단위로 관리합니다.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Diff title="배터리 교체 없음" desc="배터리 없는 태그라 충전·교체가 필요 없습니다." />
          <Diff title="얇은 스티커형 태그" desc="초박형 설계로 카드·리모컨·서류에도 부착." />
          <Diff title="다수 물건 관리에 적합" desc="태그 수십~수백 개를 한 번에 관리합니다." />
          <Diff title="허브 기반 실내 구역 탐색" desc="허브 신호 강도로 구역 단위 위치를 추정." />
        </div>
      </section>

      {/* value strip */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BatteryCharging, t: "배터리 없는 태그", d: "충전·교체 불필요" },
          { icon: Layers, t: "고유 ID 기반 구분", d: "물건별 정확한 식별" },
          { icon: MapPin, t: "구역 단위 위치 추정", d: "허브 신호 강도 기반" },
          { icon: Boxes, t: "개인·기관 모두", d: "물건 찾기 & 자산관리" },
        ].map((v) => (
          <div
            key={v.t}
            className="glass flex items-center gap-3 rounded-2xl border border-border-soft p-4"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-mint">
              <v.icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-text">{v.t}</p>
              <p className="text-xs text-muted">{v.d}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-16 overflow-hidden rounded-3xl border border-border-soft bg-gradient-to-br from-pink/10 via-surface/40 to-mint/10 p-8 text-center sm:p-14">
        <div className="mx-auto mb-5 flex justify-center">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold sm:text-3xl">
          지금 FindIt All을 시작해보세요
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          본 화면은 프로토타입 데모입니다. 허브 감지·신호 강도·위치 추정·알림은
          더미 데이터와 시뮬레이션으로 동작합니다.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setMode("personal")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-pink to-pink-soft px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink/20 transition hover:brightness-110"
          >
            <Home className="size-4" /> 개인용 시작하기
          </button>
          <button
            onClick={() => setMode("organization")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-mint to-mint-soft px-6 py-3 text-sm font-semibold text-[#04221c] shadow-lg shadow-mint/20 transition hover:brightness-105"
          >
            <Building2 className="size-4" /> 기관용 데모 보기
          </button>
        </div>
      </section>

      <footer className="mt-16 flex flex-col items-center gap-2 border-t border-border-soft pt-8 text-center">
        <Logo />
        <p className="text-xs text-muted">
          FindIt All · 배터리 없는 스티커 태그 기반 실내 분실물·자산 관리 — 프로토타입 데모
        </p>
      </footer>
    </div>
  );
}
