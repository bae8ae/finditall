"use client";

import { useEffect, useRef, useState } from "react";
import { clamp } from "./utils";

export interface SignalSim {
  value: number;
  trend: "closer" | "farther" | "steady";
  running: boolean;
  ping: () => void;
  toggle: () => void;
}

/**
 * Simulates a fluctuating tag signal between ~40 and ~95.
 * No real hardware — values drift on an interval and on manual "ping".
 */
export function useSignalSim(start = 55, auto = true): SignalSim {
  const [value, setValue] = useState(start);
  const [trend, setTrend] = useState<"closer" | "farther" | "steady">("steady");
  const [running, setRunning] = useState(auto);
  const prev = useRef(start);

  function step() {
    setValue((v) => {
      // biased random walk that tends toward the 40-95 window
      const drift = (Math.random() - 0.45) * 18;
      const next = clamp(Math.round(v + drift), 38, 96);
      setTrend(
        next > prev.current + 2
          ? "closer"
          : next < prev.current - 2
            ? "farther"
            : "steady",
      );
      prev.current = next;
      return next;
    });
  }

  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, 900);
    return () => clearInterval(id);
  }, [running]);

  return {
    value,
    trend,
    running,
    ping: step,
    toggle: () => setRunning((r) => !r),
  };
}
