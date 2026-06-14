"use client";

import {
  Activity,
  BellOff,
  HeartPulse,
  Pill,
  ShieldCheck,
  TimerReset,
  Waves,
  Wifi,
} from "lucide-react";
import { Card, SectionTitle } from "../ui/primitives";

const WAVE_BARS = [34, 52, 78, 42, 66, 92, 58, 73, 46, 84, 62, 38, 70, 51, 88, 56];

function Metric({
  label,
  value,
  tone = "text-text",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border-soft bg-bg/35 px-3 py-2.5">
      <span className="text-xs text-muted">{label}</span>
      <span className={`font-mono text-sm font-semibold ${tone}`}>{value}</span>
    </div>
  );
}

export function PersonalVitalMonitor() {
  return (
    <div className="space-y-5">
      <SectionTitle
        title="BOMI Care Signal Monitor"
        desc="Wi-Fi CSI 기반 생활 신호와 활동 변화를 카메라 없이 시각화합니다."
        icon={<Waves className="size-5" />}
      />

      <div className="grid gap-4 xl:grid-cols-[230px_minmax(0,1fr)_230px]">
        <Card className="order-2 h-fit space-y-3 xl:order-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-text">
            <HeartPulse className="size-4 text-pink-soft" /> 생활 신호
          </p>
          <Metric label="Heart Rate" value="72 BPM" tone="text-pink-soft" />
          <Metric label="Respiration" value="16 RPM" tone="text-mint" />
          <Metric label="Confidence" value="82%" />
          <p className="rounded-lg bg-pink/8 px-3 py-2 text-[11px] leading-relaxed text-pink-soft">
            데모 수치 · 의료 진단용 아님
          </p>
        </Card>

        <div className="order-1 overflow-hidden rounded-3xl border border-border-soft bg-[#0b100d] shadow-2xl shadow-black/35 xl:order-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-soft px-4 py-3 sm:px-5">
            <div>
              <p className="text-sm font-semibold text-text">거실 생활 신호</p>
              <p className="text-[11px] text-muted">
                BOMI Hub · signal demo · camera-free
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
              <span className="fit-pulse size-2 rounded-full bg-mint" />
              PRESENCE DETECTED
            </span>
          </div>

          <div className="relative min-h-[440px] overflow-hidden">
            <div className="absolute inset-x-0 bottom-[-15%] h-[70%] bomi-grid" />
            <div className="absolute inset-x-[8%] top-[10%] h-px bomi-scan-line opacity-70" />
            <div className="absolute left-1/2 top-[45%] size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/7 blur-3xl" />

            {[150, 220, 290].map((size, index) => (
              <span
                key={size}
                className="bomi-animated absolute left-1/2 top-[45%] rounded-full border border-mint/35"
                style={{
                  width: size,
                  height: size,
                  animation: `bomiPulse 3.6s ease-out ${index * 1.1}s infinite`,
                }}
              />
            ))}

            <div
              className="bomi-animated absolute left-1/2 top-[43%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ animation: "bomiFloat 4s ease-in-out infinite" }}
            >
              <span className="size-12 rounded-full border border-pink-soft/55 bg-pink/20 shadow-[0_0_32px] shadow-pink/35" />
              <span className="mt-2 h-28 w-16 rounded-[45%_45%_30%_30%] border border-mint/50 bg-gradient-to-b from-mint/25 to-mint/8 shadow-[0_0_45px] shadow-mint/25" />
              <span className="mt-[-4px] h-20 w-24 rounded-[45%_45%_20%_20%] border-x border-mint/30 opacity-80" />
            </div>

            <div className="absolute inset-x-[8%] bottom-6 rounded-2xl border border-border-soft bg-bg/65 p-3 backdrop-blur">
              <div className="flex h-16 items-end justify-between gap-1">
                {WAVE_BARS.map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="bomi-animated w-full origin-bottom rounded-full bg-gradient-to-t from-mint/25 to-mint"
                    style={{
                      height: `${height}%`,
                      animation: `bomiWave 1.5s ease-in-out ${index * 0.08}s infinite`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                <span>activity signal</span>
                <span>live demo · 2.4 GHz</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="order-3 h-fit space-y-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-text">
            <Wifi className="size-4 text-mint" /> Wi-Fi Signal
          </p>
          <Metric label="RSSI" value="-38 dBm" />
          <Metric label="Variance" value="2.60" />
          <Metric label="Motion" value="0.132" />
          <Metric label="Persons" value="1" />
          <Metric label="Presence" value="PRESENT" tone="text-mint" />
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: TimerReset,
            title: "장시간 무반응 기준까지 12분 남음",
            desc: "현재 활동 신호는 안정적으로 이어지고 있습니다.",
          },
          {
            icon: Activity,
            title: "평소 오전 활동 패턴과 유사",
            desc: "최근 7일의 같은 시간대와 비교한 데모 분석입니다.",
          },
          {
            icon: Pill,
            title: "약통 태그 최근 감지: 07:58",
            desc: "아침 약통 사용 이벤트가 확인되었습니다.",
          },
          {
            icon: BellOff,
            title: "보호자 알림 없음",
            desc: "현재 즉시 확인이 필요한 이벤트가 없습니다.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="p-4">
            <Icon className="size-5 text-mint" />
            <p className="mt-3 text-sm font-semibold text-text">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{desc}</p>
          </Card>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-pink/20 bg-pink/7 p-4 text-xs leading-relaxed text-muted">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-pink-soft" />
        <p>
          BOMI는 생활 안전 이벤트를 보조적으로 전달하며, 응급 상황에서는 보호자
          또는 의료기관 확인이 필요합니다. 화면의 바이털 수치는 신호 시각화를
          위한 데모이며 의료 진단에 사용할 수 없습니다.
        </p>
      </div>
    </div>
  );
}
