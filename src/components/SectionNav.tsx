"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface SectionItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

export function SectionNav({
  items,
  active,
  onChange,
  accent = "mint",
}: {
  items: SectionItem[];
  active: string;
  onChange: (k: string) => void;
  accent?: "mint" | "pink";
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {items.map((it) => {
        const on = active === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition",
              on
                ? accent === "pink"
                  ? "border-pink/40 bg-pink/12 text-pink-soft"
                  : "border-mint/40 bg-mint/12 text-mint"
                : "border-border-soft bg-surface/40 text-muted hover:text-text",
            )}
          >
            <it.icon className="size-4" />
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
