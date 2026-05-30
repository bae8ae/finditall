"use client";

import { useState } from "react";
import {
  LayoutDashboard, Package, Router, Map, Bell, Sparkles, Users,
} from "lucide-react";
import { SectionNav, type SectionItem } from "../SectionNav";
import { Button } from "../ui/primitives";
import { PersonalDashboard } from "./PersonalDashboard";
import { PersonalItems } from "./PersonalItems";
import { PersonalHubs } from "./PersonalHubs";
import { PersonalMap } from "./PersonalMap";
import { PersonalHistory } from "./PersonalHistory";
import { PersonalPricing } from "./PersonalPricing";
import { GuestFindModal } from "./GuestFindModal";
import { FindModeModal } from "../FindModeModal";
import { AddTagModal } from "../AddTagModal";
import type { Tag } from "@/lib/types";

const NAV: SectionItem[] = [
  { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
  { key: "items", label: "내 물건", icon: Package },
  { key: "hubs", label: "허브", icon: Router },
  { key: "map", label: "실내 지도", icon: Map },
  { key: "history", label: "알림/히스토리", icon: Bell },
  { key: "pricing", label: "요금제", icon: Sparkles },
];

export function PersonalApp() {
  const [section, setSection] = useState("dashboard");
  const [findTag, setFindTag] = useState<Tag | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  const onFind = (t: Tag) => setFindTag(t);

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 fit-fade">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SectionNav items={NAV} active={section} onChange={setSection} accent="pink" />
        <Button variant="outline" size="sm" onClick={() => setGuestOpen(true)}>
          <Users className="size-4" /> Guest Find
        </Button>
      </div>

      {section === "dashboard" && (
        <PersonalDashboard onFind={onFind} goItems={() => setSection("items")} />
      )}
      {section === "items" && (
        <PersonalItems onFind={onFind} onAdd={() => setAddOpen(true)} />
      )}
      {section === "hubs" && <PersonalHubs />}
      {section === "map" && <PersonalMap onFind={onFind} />}
      {section === "history" && <PersonalHistory />}
      {section === "pricing" && <PersonalPricing />}

      <FindModeModal
        tag={findTag}
        open={!!findTag}
        onClose={() => setFindTag(null)}
        variant="personal"
      />
      <AddTagModal open={addOpen} onClose={() => setAddOpen(false)} />
      <GuestFindModal open={guestOpen} onClose={() => setGuestOpen(false)} />
    </div>
  );
}
