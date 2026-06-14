"use client";

import { useState } from "react";
import {
  BellRing,
  Building2,
  FileBarChart,
  LayoutDashboard,
  MapPinned,
  Router,
  Shield,
  Users,
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
import { AddAssetModal } from "../AddAssetModal";

const NAV: SectionItem[] = [
  { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
  { key: "users", label: "이용자 관리", icon: Users },
  { key: "map", label: "구역 맵", icon: MapPinned },
  { key: "hubs", label: "허브/구역", icon: Router },
  { key: "events", label: "이벤트 관제", icon: BellRing },
  { key: "permissions", label: "권한 관리", icon: Shield },
  { key: "reports", label: "리포트", icon: FileBarChart },
  { key: "pricing", label: "요금제", icon: Building2 },
];

export function OrganizationApp() {
  const [section, setSection] = useState("dashboard");
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="fit-fade mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <div className="mb-5">
        <SectionNav
          items={NAV}
          active={section}
          onChange={setSection}
          accent="mint"
        />
      </div>

      {section === "dashboard" && <OrganizationDashboard />}
      {section === "users" && <AssetTable onAdd={() => setAddOpen(true)} />}
      {section === "map" && <OrganizationMap />}
      {section === "hubs" && <HubManagement />}
      {section === "events" && <AssetSearchPanel />}
      {section === "permissions" && <UserPermissionPanel />}
      {section === "reports" && <ReportDashboard />}
      {section === "pricing" && <OrganizationPricing />}

      <AddAssetModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
