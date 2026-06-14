"use client";

import { cn, signalLabel, clamp } from "@/lib/utils";

function toneColor(s: number): string {
  if (s >= 70) return "#8fa37a";
  if (s >= 45) return "#d9a441";
  if (s >= 20) return "#e66b6b";
  return "#afa89a";
}

/** Horizontal signal bar with segmented fill. */
export function SignalBar({
  value,
  className,
  showLabel = true,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const v = clamp(value, 0, 100);
  const { label, tone } = signalLabel(v);
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="text-muted">신호 강도</span>
          <span className={cn("font-semibold", tone)}>
            {v} · {label}
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${v}%`,
            background: `linear-gradient(90deg, ${toneColor(v)}, ${toneColor(v)}cc)`,
            boxShadow: `0 0 12px ${toneColor(v)}66`,
          }}
        />
      </div>
    </div>
  );
}

/** Circular ring gauge for find-mode. */
export function SignalRing({
  value,
  size = 200,
  trend,
}: {
  value: number;
  size?: number;
  trend?: "closer" | "farther" | "steady";
}) {
  const v = clamp(value, 0, 100);
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  const color = toneColor(v);
  const { label } = signalLabel(v);

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      {/* radar ping rings */}
      {v >= 45 && (
        <>
          <span
            className="absolute rounded-full"
            style={{
              width: size * 0.5,
              height: size * 0.5,
              border: `2px solid ${color}`,
              animation: "fitPing 2s ease-out infinite",
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              width: size * 0.5,
              height: size * 0.5,
              border: `2px solid ${color}`,
              animation: "fitPing 2s ease-out 1s infinite",
            }}
          />
        </>
      )}
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1f241e"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.6s ease, stroke 0.4s",
            filter: `drop-shadow(0 0 8px ${color}88)`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold" style={{ color }}>
          {v}
        </span>
        <span className="text-xs text-muted">{label}</span>
        {trend && (
          <span
            className={cn(
              "mt-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              trend === "closer"
                ? "bg-mint/15 text-mint"
                : trend === "farther"
                  ? "bg-danger/15 text-danger"
                  : "bg-surface-2 text-muted",
            )}
          >
            {trend === "closer"
              ? "가까워지는 중"
              : trend === "farther"
                ? "멀어지는 중"
                : "신호 유지 중"}
          </span>
        )}
      </div>
    </div>
  );
}

/** Compact radar dot for maps. */
export function RadarDot({ active }: { active?: boolean }) {
  return (
    <span className="relative grid place-items-center">
      {active && (
        <span
          className="absolute rounded-full"
          style={{
            width: 18,
            height: 18,
            border: "2px solid #8fa37a",
            animation: "fitPing 1.8s ease-out infinite",
          }}
        />
      )}
      <span
        className={cn(
          "size-2.5 rounded-full",
          active ? "bg-mint" : "bg-muted",
        )}
      />
    </span>
  );
}
