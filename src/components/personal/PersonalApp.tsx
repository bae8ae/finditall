"use client";

import { useState } from "react";
import {
  Bell,
  HeartPulse,
  LayoutDashboard,
  Package,
  Router,
  Sparkles,
} from "lucide-react";
import { SectionNav, type SectionItem } from "../SectionNav";
import { PersonalDashboard } from "./PersonalDashboard";
import { PersonalVitalMonitor } from "./PersonalVitalMonitor";
import { PersonalItems } from "./PersonalItems";
import { PersonalHubs } from "./PersonalHubs";
import { PersonalHistory } from "./PersonalHistory";
import { PersonalPricing } from "./PersonalPricing";
import { FindModeModal } from "../FindModeModal";
import { AddTagModal } from "../AddTagModal";
import type { Tag } from "@/lib/types";

const NAV: SectionItem[] = [
  { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
  { key: "vital", label: "바이털/신호", icon: HeartPulse },
  { key: "items", label: "복약·물품", icon: Package },
  { key: "hubs", label: "허브", icon: Router },
  { key: "history", label: "이벤트", icon: Bell },
  { key: "pricing", label: "요금제", icon: Sparkles },
];

export function PersonalApp() {
  const [section, setSection] = useState("dashboard");
  const [findTag, setFindTag] = useState<Tag | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="fit-fade mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <div className="mb-5">
        <SectionNav
          items={NAV}
          active={section}
          onChange={setSection}
          accent="pink"
        />
      </div>

      {section === "dashboard" && (
        <PersonalDashboard
          goItems={() => setSection("items")}
          goVital={() => setSection("vital")}
        />
      )}
      {section === "vital" && <PersonalVitalMonitor />}
      {section === "items" && (
        <PersonalItems
          onFind={setFindTag}
          onAdd={() => setAddOpen(true)}
        />
      )}
      {section === "hubs" && <PersonalHubs />}
      {section === "history" && <PersonalHistory />}
      {section === "pricing" && <PersonalPricing />}

      <FindModeModal
        tag={findTag}
        open={!!findTag}
        onClose={() => setFindTag(null)}
        variant="personal"
      />
      <AddTagModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
