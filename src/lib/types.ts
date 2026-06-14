export type OwnerType = "personal" | "organization";

export type TagStatus =
  | "normal"
  | "searching"
  | "missing"
  | "lowSignal"
  | "archived";

export type HubStatus = "online" | "offline" | "warning";

export type ZoneType =
  | "home"
  | "office"
  | "hospital"
  | "lab"
  | "hotel"
  | "school";

export type Importance = "low" | "normal" | "high";

export type UserRole = "personal" | "admin" | "manager" | "staff" | "viewer";

export interface Tag {
  id: string;
  tagCode: string;
  name: string;
  category: string;
  ownerType: OwnerType;
  status: TagStatus;
  lastDetectedZone: string;
  lastDetectedHub: string;
  signalStrength: number; // 0-100
  lastDetectedAt: string; // ISO
  batteryType: "Batteryless";
  notes?: string;
  icon: string; // lucide icon key
  // organization-only
  department?: string;
  assignee?: string;
  importance?: Importance;
  homeZoneId?: string; // assigned/expected zone id for geofence
}

export interface Hub {
  id: string;
  name: string;
  zone: string;
  zoneId: string;
  status: HubStatus;
  connectedTagsCount: number;
  coverageRadius: number; // meters
  lastSyncAt: string;
  ownerType: OwnerType;
}

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  floor: string;
  description: string;
  hubIds: string[];
  ownerType: OwnerType;
  // layout (percentage based grid for the floor map)
  col: number;
  row: number;
  w: number;
  h: number;
}

export interface DetectionLog {
  id: string;
  tagId: string;
  tagName: string;
  hubId: string;
  hubName: string;
  zone: string;
  signalStrength: number;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  ownerType: OwnerType;
  kind: "info" | "warn" | "danger" | "ok";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  zones: string;
  status: "active" | "invited" | "disabled";
}

export type PresenceStatus = "present" | "away" | "inactive" | "unknown";

export type MedicationStatus =
  | "confirmed"
  | "unconfirmed"
  | "scheduled"
  | "not-applicable";

export type CareEventType =
  | "활동 감지"
  | "장시간 무반응"
  | "복약 확인"
  | "복약 미확인"
  | "낙상 의심"
  | "외출 감지"
  | "귀가 감지"
  | "보호자 확인 요청"
  | "허브 오프라인"
  | "담당자 확인 완료";

export interface CareEvent {
  id: string;
  ownerType: OwnerType;
  personName?: string;
  type: CareEventType;
  location: string;
  severity: "info" | "normal" | "warning" | "critical";
  guardianNotified: boolean;
  status: "new" | "checking" | "confirmed" | "resolved";
  timestamp: string;
  description: string;
}

export interface VitalSignal {
  heartRate: number;
  respiration: number;
  confidence: number;
  motion: number;
  rssi: number;
  variance: number;
  persons: number;
  presence: PresenceStatus;
}
