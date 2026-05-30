"use client";

import { useState } from "react";
import {
  LayoutDashboard, Table2, MapPinned, Router, Crosshair, Shield,
  FileBarChart, Building2,
} from "lucide-react";
import { SectionNav, type SectionItem } from "../SectionNav";
import { OrganizationDashboard } from "./OrganizationDashboard";
import { AssetTable } from "./AssetTable";
import { OrganizationMap } from "./OrganizationMap";
import { HubManagement } from "./HubManagement";
import { AssetSearchPanel } from "./AssetSearchPanel";
import { UserPermissionPanel } from "./UserPermissionPanel";
import { ReportDashboard } from "./ReportDashboard";
import { OrganizationPricing } from "./OrganizationPricing";
import { FindModeModal } from "../FindModeModal";
import { AddAssetModal } from "../AddAssetModal";
import type { Tag } from "@/lib/types";

const NAV: SectionItem[] = [
  { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
  { key: "assets", label: "자산 목록", icon: Table2 },
  { key: "map", label: "자산 맵", icon: MapPinned },
  { key: "hubs", label: "허브/구역", icon: Router },
  { key: "search", label: "자산 탐색", icon: Crosshair },
  { key: "permissions", label: "권한 관리", icon: Shield },
  { key: "reports", label: "리포트", icon: FileBarChart },
  { key: "pricing", label: "요금제", icon: Building2 },
];

export function OrganizationApp() {
  const [section, setSection] = useState("dashboard");
  const [searchTag, setSearchTag] = useState<Tag | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const onSearch = (t: Tag) => setSearchTag(t);

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 fit-fade">
      <div className="mb-5">
        <SectionNav items={NAV} active={section} onChange={setSection} accent="mint" />
      </div>

      {section === "dashboard" && <OrganizationDashboard />}
      {section === "assets" && <AssetTable onSearch={onSearch} onAdd={() => setAddOpen(true)} />}
      {section === "map" && <OrganizationMap onSearch={onSearch} />}
      {section === "hubs" && <HubManagement />}
      {section === "search" && <AssetSearchPanel onSearch={onSearch} />}
      {section === "permissions" && <UserPermissionPanel />}
      {section === "reports" && <ReportDashboard />}
      {section === "pricing" && <OrganizationPricing />}

      <FindModeModal
        tag={searchTag}
        open={!!searchTag}
        onClose={() => setSearchTag(null)}
        variant="organization"
      />
      <AddAssetModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
