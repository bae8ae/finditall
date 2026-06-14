"use client";

import {
  ArrowRight,
  BatteryCharging,
  BellRing,
  Building2,
  Check,
  DoorOpen,
  Home,
  KeyRound,
  LockKeyhole,
  Pill,
  Radar,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  WalletCards,
  Waves,
  Wifi,
} from "lucide-react";
import type { Mode } from "./Header";
import { Logo } from "./Header";

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="glass rounded-2xl border border-border-soft p-6">
      <div className="mb-4 grid size-12 place-items-center rounded-xl bg-gradient-to-br from-pink/18 to-mint/12 text-mint">
        {icon}
      </div>
      <h3 className="text-base font-bold text-text">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

function TrustItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-border-soft bg-surface/40 p-4">
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mint/15 text-mint">
        <Check className="size-4" />
      </span>
      <div>
        <p className="text-sm font-semibold text-text">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{desc}</p>
      </div>
    </div>
  );
}

export function LandingHero({ setMode }: { setMode: (m: Mode) => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <section className="relative overflow-hidden pb-14 pt-14 text-center sm:pt-20">
        <div className="fit-fade mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/50 px-4 py-1.5 text-xs font-medium text-muted">
          <Sparkles className="size-3.5 text-pink-soft" />
          Camera-free Care Hub · Wi-Fi CSI · Batteryless RFID
        </div>
        <h1 className="fit-fade mx-auto max-w-4xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl">
          보지 않고도,
          <br className="sm:hidden" />{" "}
          <span className="gradient-text">곁에서 봅니다.</span>
        </h1>
        <p className="fit-fade mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
          BOMI는 카메라 없이 Wi-Fi CSI 신호와 배터리 없는 RFID 태그를 이용해,
          혼자 있는 시간의 작은 변화를 감지하고 보호자에게 필요한 순간만 알려주는
          생활 안전 돌봄 허브입니다.
        </p>
        <p className="mt-3 text-sm font-medium text-pink-soft">
          By your side, without watching.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <button
            onClick={() => setMode("personal")}
            className="group glass relative overflow-hidden rounded-2xl border border-border-soft p-6 text-left transition hover:border-pink/40"
          >
            <div className="mb-4 grid size-12 place-items-center rounded-xl bg-pink/15 text-pink-soft">
              <Home className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-text">BOMI Family</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              혼자 사는 부모님의 활동, 복약, 외출·귀가와 필수 물품을 한눈에
              확인합니다.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pink-soft">
              BOMI Family 데모 보기
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </button>

          <button
            onClick={() => setMode("organization")}
            className="group glass relative overflow-hidden rounded-2xl border border-border-soft p-6 text-left transition hover:border-mint/40"
          >
            <div className="mb-4 grid size-12 place-items-center rounded-xl bg-mint/15 text-mint">
              <Building2 className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-text">BOMI Facility</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              복지관·요양시설·방문돌봄 기관의 생활 안전 이벤트를 영상 없이 통합
              관리합니다.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mint">
              BOMI Facility 데모 보기
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </section>

      <section className="pt-10">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-mint">
          Everyday risks
        </p>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          혼자 있는 시간, 놓치기 쉬운 변화
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<Pill className="size-6" />}
            title="복약 누락"
            desc="약통을 찾지 못하거나 복용 시간이 흔들릴 수 있습니다."
          />
          <FeatureCard
            icon={<UserRoundCheck className="size-6" />}
            title="장시간 무반응"
            desc="혼자 있는 집에서 오랜 시간 움직임이 없어도 보호자는 늦게 알 수 있습니다."
          />
          <FeatureCard
            icon={<KeyRound className="size-6" />}
            title="필수 물품 분실"
            desc="열쇠, 지갑, 약통, 외출가방처럼 꼭 필요한 물건의 위치를 놓칠 수 있습니다."
          />
        </div>
      </section>

      <section className="mt-16">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-pink-soft">
          BOMI Care + BOMI Find
        </p>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          하나의 허브, 두 개의 감지 방식
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="glass rounded-3xl border border-mint/25 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-mint/12 text-mint">
                <Waves className="size-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-mint">
                  Wi-Fi CSI
                </p>
                <h3 className="text-xl font-bold text-text">BOMI Care</h3>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              영상 촬영이나 웨어러블 착용 없이 Wi-Fi 전파의 변화를 해석해 사람의
              생활 변화를 감지합니다.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                "움직임 감지",
                "장시간 무반응 알림",
                "낙상 의심 패턴",
                "실험적 호흡 추세",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-surface-2/70 px-3 py-2.5 text-sm text-text"
                >
                  <Check className="size-4 text-mint" /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl border border-pink/25 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-pink/12 text-pink-soft">
                <Radar className="size-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-pink-soft">
                  Batteryless RFID
                </p>
                <h3 className="text-xl font-bold text-text">BOMI Find</h3>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              배터리 없는 RFID 태그로 필수 물품의 구역 단위 위치와 사용·이동
              변화를 감지합니다.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                { icon: Pill, label: "약통" },
                { icon: KeyRound, label: "열쇠" },
                { icon: DoorOpen, label: "외출가방" },
                { icon: WalletCards, label: "지갑 등" },
              ].map(({ icon: ItemIcon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-xl bg-surface-2/70 px-3 py-2.5 text-sm text-text"
                >
                  <ItemIcon className="size-4 text-pink-soft" /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 grid items-center gap-8 rounded-3xl border border-border-soft bg-surface/30 p-6 sm:p-10 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-mint">
            Privacy by design
          </p>
          <h2 className="text-2xl font-bold leading-snug sm:text-3xl">
            영상 대신,
            <br />
            <span className="gradient-text">필요한 이벤트만 전달합니다.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            홈카메라처럼 촬영하지 않고, raw 데이터를 그대로 노출하지 않습니다.
            BOMI Hub가 생활 신호를 이벤트로 변환해 보호자에게 필요한 순간만
            연결합니다.
          </p>
          <p className="mt-5 rounded-2xl border border-pink/20 bg-pink/7 p-4 text-sm font-semibold leading-relaxed text-text">
            BOMI는 사용자를 감시하지 않습니다. 필요한 순간의 변화만 보호자에게
            연결합니다.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TrustItem
            title="raw CSI 장기 저장 금지"
            desc="원시 신호 대신 이벤트 중심으로 처리합니다."
          />
          <TrustItem
            title="이벤트 변환 전송"
            desc="활동·무반응·복약 등 필요한 정보만 전달합니다."
          />
          <TrustItem
            title="암호화 통신"
            desc="허브와 서비스 사이의 데이터를 보호합니다."
          />
          <TrustItem
            title="보호자 권한 분리"
            desc="가족과 기관 담당자의 접근 범위를 구분합니다."
          />
          <TrustItem
            title="수집 목적 투명 안내"
            desc="무엇을 왜 감지하는지 사용자에게 설명합니다."
          />
          <TrustItem
            title="착용·충전 부담 없음"
            desc="웨어러블 없이 일상 공간에서 동작합니다."
          />
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: ShieldCheck,
            title: "카메라 없는 돌봄",
            desc: "영상 촬영 없이 생활 변화 감지",
          },
          {
            icon: BatteryCharging,
            title: "배터리 없는 태그",
            desc: "약통·열쇠·가방 사용 변화",
          },
          {
            icon: BellRing,
            title: "이벤트 중심 알림",
            desc: "raw 데이터 대신 필요한 순간만",
          },
          {
            icon: LockKeyhole,
            title: "권한 기반 보호",
            desc: "가족·기관 담당자 접근 분리",
          },
        ].map((value) => (
          <div
            key={value.title}
            className="glass flex items-center gap-3 rounded-2xl border border-border-soft p-4"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-mint">
              <value.icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-text">{value.title}</p>
              <p className="text-xs text-muted">{value.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-border-soft bg-surface/25 p-5 text-sm leading-relaxed text-muted">
        <Wifi className="mr-2 inline size-4 text-mint" />
        CSI 기반 감지 방식은 향후 외출 중이나 수면 중 창문·문 열림처럼 실내 전파
        환경이 갑자기 바뀌는 상황을 이상 이벤트로 감지하는 생활 안전 기능으로
        확장될 수 있습니다. 전문 보안 서비스를 대체하지 않습니다.
      </section>

      <section className="mt-16 overflow-hidden rounded-3xl border border-border-soft bg-gradient-to-br from-pink/10 via-surface/40 to-mint/10 p-8 text-center sm:p-14">
        <div className="mx-auto mb-5 flex justify-center">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold sm:text-3xl">
          카메라 없이 이어지는 돌봄을 만나보세요
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          본 화면은 BOMI Care와 BOMI Find의 프로토타입 데모입니다. 신호, 활동,
          복약, 위치 변화 데이터는 시뮬레이션으로 동작합니다.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setMode("personal")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-pink to-pink-soft px-6 py-3 text-sm font-semibold text-[#17150f] shadow-lg shadow-pink/20 transition hover:brightness-110"
          >
            <Home className="size-4" /> BOMI Family 데모
          </button>
          <button
            onClick={() => setMode("organization")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-mint to-mint-soft px-6 py-3 text-sm font-semibold text-[#10130f] shadow-lg shadow-mint/20 transition hover:brightness-105"
          >
            <Building2 className="size-4" /> BOMI Facility 데모
          </button>
        </div>
      </section>

      <footer className="mt-16 flex flex-col items-center gap-2 border-t border-border-soft pt-8 text-center">
        <Logo />
        <p className="text-xs text-muted">
          BOMI · 카메라 없이 지켜주는 생활 안전 돌봄 허브 · 프로토타입 데모
        </p>
      </footer>
    </div>
  );
}
