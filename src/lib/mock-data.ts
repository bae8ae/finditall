import type {
  AppNotification,
  CareEvent,
  DetectionLog,
  Hub,
  OrgMember,
  Tag,
  Zone,
} from "./types";

const iso = (now: number, minutesAgo: number) =>
  new Date(now - minutesAgo * 60000).toISOString();

export function personalZones(): Zone[] {
  return [
    { id: "pz-entry", name: "현관", type: "home", floor: "1F", description: "외출·귀가와 필수 물품 감지", hubIds: ["ph-entry"], ownerType: "personal", col: 0, row: 1, w: 1, h: 1 },
    { id: "pz-living", name: "거실", type: "home", floor: "1F", description: "주요 생활 활동 감지", hubIds: ["ph-living"], ownerType: "personal", col: 1, row: 0, w: 2, h: 2 },
    { id: "pz-kitchen", name: "주방", type: "home", floor: "1F", description: "식사·복약 생활 변화", hubIds: ["ph-kitchen"], ownerType: "personal", col: 3, row: 0, w: 1, h: 1 },
    { id: "pz-bed", name: "침실", type: "home", floor: "1F", description: "수면·무반응 변화 감지", hubIds: ["ph-bed"], ownerType: "personal", col: 0, row: 0, w: 1, h: 1 },
    { id: "pz-care", name: "복약함", type: "home", floor: "1F", description: "약통 사용과 위치 변화", hubIds: [], ownerType: "personal", col: 3, row: 1, w: 1, h: 1 },
  ];
}

export function orgZones(): Zone[] {
  return [
    { id: "oz-entry", name: "1층 현관", type: "hospital", floor: "1F", description: "외출·귀가 감지", hubIds: ["oh-entry"], ownerType: "organization", col: 0, row: 0, w: 2, h: 1 },
    { id: "oz-control", name: "1층 관제실", type: "office", floor: "1F", description: "담당자 이벤트 관제", hubIds: ["oh-control"], ownerType: "organization", col: 2, row: 0, w: 2, h: 1 },
    { id: "oz-living2", name: "2층 생활실", type: "hospital", floor: "2F", description: "생활 활동·무반응 감지", hubIds: ["oh-living2-a", "oh-living2-b"], ownerType: "organization", col: 0, row: 1, w: 2, h: 1 },
    { id: "oz-med", name: "2층 복약함", type: "hospital", floor: "2F", description: "이용자 복약 확인", hubIds: ["oh-med"], ownerType: "organization", col: 2, row: 1, w: 1, h: 1 },
    { id: "oz-living3", name: "3층 생활실", type: "hospital", floor: "3F", description: "생활 안전 이벤트 감지", hubIds: ["oh-living3"], ownerType: "organization", col: 0, row: 2, w: 2, h: 1 },
    { id: "oz-rest", name: "3층 휴게실", type: "hospital", floor: "3F", description: "공용 생활 공간", hubIds: ["oh-rest"], ownerType: "organization", col: 2, row: 2, w: 2, h: 1 },
  ];
}

export function personalHubs(now: number): Hub[] {
  return [
    { id: "ph-living", name: "거실 허브", zone: "거실", zoneId: "pz-living", status: "online", connectedTagsCount: 3, coverageRadius: 8, lastSyncAt: iso(now, 1), ownerType: "personal" },
    { id: "ph-bed", name: "침실 허브", zone: "침실", zoneId: "pz-bed", status: "online", connectedTagsCount: 1, coverageRadius: 6, lastSyncAt: iso(now, 3), ownerType: "personal" },
    { id: "ph-entry", name: "현관 허브", zone: "현관", zoneId: "pz-entry", status: "online", connectedTagsCount: 3, coverageRadius: 5, lastSyncAt: iso(now, 2), ownerType: "personal" },
    { id: "ph-kitchen", name: "주방 허브", zone: "주방", zoneId: "pz-kitchen", status: "online", connectedTagsCount: 2, coverageRadius: 6, lastSyncAt: iso(now, 4), ownerType: "personal" },
  ];
}

export function orgHubs(now: number): Hub[] {
  return [
    { id: "oh-entry", name: "1층 현관 허브", zone: "1층 현관", zoneId: "oz-entry", status: "online", connectedTagsCount: 18, coverageRadius: 12, lastSyncAt: iso(now, 1), ownerType: "organization" },
    { id: "oh-control", name: "관제실 허브", zone: "1층 관제실", zoneId: "oz-control", status: "online", connectedTagsCount: 4, coverageRadius: 8, lastSyncAt: iso(now, 2), ownerType: "organization" },
    { id: "oh-living2-a", name: "2층 생활실 허브 A", zone: "2층 생활실", zoneId: "oz-living2", status: "online", connectedTagsCount: 31, coverageRadius: 12, lastSyncAt: iso(now, 1), ownerType: "organization" },
    { id: "oh-living2-b", name: "2층 생활실 허브 B", zone: "2층 생활실", zoneId: "oz-living2", status: "warning", connectedTagsCount: 24, coverageRadius: 12, lastSyncAt: iso(now, 17), ownerType: "organization" },
    { id: "oh-med", name: "2층 복약함 허브", zone: "2층 복약함", zoneId: "oz-med", status: "online", connectedTagsCount: 42, coverageRadius: 7, lastSyncAt: iso(now, 3), ownerType: "organization" },
    { id: "oh-living3", name: "3층 생활실 허브", zone: "3층 생활실", zoneId: "oz-living3", status: "offline", connectedTagsCount: 0, coverageRadius: 12, lastSyncAt: iso(now, 65), ownerType: "organization" },
    { id: "oh-rest", name: "3층 휴게실 허브", zone: "3층 휴게실", zoneId: "oz-rest", status: "online", connectedTagsCount: 21, coverageRadius: 10, lastSyncAt: iso(now, 5), ownerType: "organization" },
  ];
}

export function personalTags(now: number): Tag[] {
  return [
    { id: "pt-1", tagCode: "BOMI-M001", name: "저녁 약통", category: "약통", ownerType: "personal", status: "lowSignal", lastDetectedZone: "복약함", lastDetectedHub: "주방 허브", signalStrength: 42, lastDetectedAt: iso(now, 146), batteryType: "Batteryless", icon: "pill", notes: "오늘 저녁 복약 미확인", homeZoneId: "pz-care" },
    { id: "pt-2", tagCode: "BOMI-M002", name: "아침 약통", category: "약통", ownerType: "personal", status: "normal", lastDetectedZone: "복약함", lastDetectedHub: "주방 허브", signalStrength: 78, lastDetectedAt: iso(now, 152), batteryType: "Batteryless", icon: "pill", notes: "07:58 복약 확인", homeZoneId: "pz-care" },
    { id: "pt-3", tagCode: "BOMI-F003", name: "열쇠", category: "열쇠", ownerType: "personal", status: "normal", lastDetectedZone: "현관", lastDetectedHub: "현관 허브", signalStrength: 81, lastDetectedAt: iso(now, 12), batteryType: "Batteryless", icon: "key", notes: "현관 수납함", homeZoneId: "pz-entry" },
    { id: "pt-4", tagCode: "BOMI-F004", name: "지갑", category: "지갑", ownerType: "personal", status: "normal", lastDetectedZone: "거실", lastDetectedHub: "거실 허브", signalStrength: 67, lastDetectedAt: iso(now, 28), batteryType: "Batteryless", icon: "wallet", notes: "", homeZoneId: "pz-living" },
    { id: "pt-5", tagCode: "BOMI-F005", name: "외출가방", category: "외출가방", ownerType: "personal", status: "searching", lastDetectedZone: "현관", lastDetectedHub: "현관 허브", signalStrength: 55, lastDetectedAt: iso(now, 209), batteryType: "Batteryless", icon: "briefcase", notes: "06:55 외출 이벤트와 함께 이동", homeZoneId: "pz-entry" },
    { id: "pt-6", tagCode: "BOMI-F006", name: "휴대폰", category: "휴대폰", ownerType: "personal", status: "normal", lastDetectedZone: "거실", lastDetectedHub: "거실 허브", signalStrength: 90, lastDetectedAt: iso(now, 3), batteryType: "Batteryless", icon: "smartphone", notes: "", homeZoneId: "pz-living" },
    { id: "pt-7", tagCode: "BOMI-F007", name: "보조 안경", category: "보조 안경", ownerType: "personal", status: "missing", lastDetectedZone: "침실", lastDetectedHub: "침실 허브", signalStrength: 0, lastDetectedAt: iso(now, 1620), batteryType: "Batteryless", icon: "glasses", notes: "장기 미감지", homeZoneId: "pz-bed" },
    { id: "pt-8", tagCode: "BOMI-F008", name: "복지카드", category: "복지카드", ownerType: "personal", status: "normal", lastDetectedZone: "현관", lastDetectedHub: "현관 허브", signalStrength: 72, lastDetectedAt: iso(now, 35), batteryType: "Batteryless", icon: "id-card", notes: "", homeZoneId: "pz-entry" },
  ];
}

export function orgTags(now: number): Tag[] {
  const people = [
    ["ot-1", "김영자 님", "2층 생활실", "oh-living2-a", "2층 생활실 허브 A", "lowSignal", 62, 22, "생활지원 1팀", "이수진", "낙상 위험군 · 저녁 복약 확인 필요"],
    ["ot-2", "박순옥 님", "2층 복약함", "oh-med", "2층 복약함 허브", "lowSignal", 48, 47, "생활지원 1팀", "박민아", "저녁 약 미확인"],
    ["ot-3", "이정호 님", "1층 현관", "oh-entry", "1층 현관 허브", "searching", 53, 95, "생활지원 2팀", "정현우", "외출 후 귀가 확인 중"],
    ["ot-4", "최말자 님", "3층 휴게실", "oh-rest", "3층 휴게실 허브", "normal", 77, 8, "생활지원 2팀", "한서윤", "활동 패턴 정상"],
    ["ot-5", "윤정희 님", "2층 생활실", "oh-living2-b", "2층 생활실 허브 B", "normal", 69, 13, "방문돌봄팀", "오지훈", "오전 활동 확인"],
    ["ot-6", "강춘자 님", "3층 생활실", "oh-living3", "3층 생활실 허브", "missing", 0, 65, "방문돌봄팀", "김다은", "허브 오프라인으로 확인 필요"],
    ["ot-7", "서영수 님", "2층 생활실", "oh-living2-a", "2층 생활실 허브 A", "normal", 74, 6, "생활지원 1팀", "이수진", "정상 활동"],
    ["ot-8", "한복례 님", "3층 휴게실", "oh-rest", "3층 휴게실 허브", "normal", 71, 18, "생활지원 2팀", "한서윤", "귀가 확인"],
  ] as const;

  return people.map(([id, name, zone, hubId, hubName, status, signal, minutes, department, assignee, notes], index) => ({
    id,
    tagCode: `BOMI-U${String(index + 1).padStart(3, "0")}`,
    name,
    category: "생활 안전 관리",
    ownerType: "organization",
    status,
    lastDetectedZone: zone,
    lastDetectedHub: hubName,
    signalStrength: signal,
    lastDetectedAt: iso(now, minutes),
    batteryType: "Batteryless",
    icon: "user",
    department,
    assignee,
    importance: index < 3 ? "high" : "normal",
    homeZoneId:
      hubId === "oh-entry"
        ? "oz-entry"
        : hubId === "oh-med"
          ? "oz-med"
          : hubId === "oh-living3"
            ? "oz-living3"
            : hubId === "oh-rest"
              ? "oz-rest"
              : "oz-living2",
    notes,
  }));
}

export function personalLogs(now: number): DetectionLog[] {
  return [
    { id: "pl-1", tagId: "pt-6", tagName: "휴대폰", hubId: "ph-living", hubName: "거실 허브", zone: "거실", signalStrength: 90, timestamp: iso(now, 3) },
    { id: "pl-2", tagId: "pt-3", tagName: "열쇠", hubId: "ph-entry", hubName: "현관 허브", zone: "현관", signalStrength: 81, timestamp: iso(now, 12) },
    { id: "pl-3", tagId: "pt-4", tagName: "지갑", hubId: "ph-living", hubName: "거실 허브", zone: "거실", signalStrength: 67, timestamp: iso(now, 28) },
    { id: "pl-4", tagId: "pt-8", tagName: "복지카드", hubId: "ph-entry", hubName: "현관 허브", zone: "현관", signalStrength: 72, timestamp: iso(now, 35) },
    { id: "pl-5", tagId: "pt-2", tagName: "아침 약통", hubId: "ph-kitchen", hubName: "주방 허브", zone: "복약함", signalStrength: 78, timestamp: iso(now, 152) },
  ];
}

export function orgLogs(now: number): DetectionLog[] {
  return [
    { id: "ol-1", tagId: "ot-7", tagName: "서영수 님", hubId: "oh-living2-a", hubName: "2층 생활실 허브 A", zone: "2층 생활실", signalStrength: 74, timestamp: iso(now, 6) },
    { id: "ol-2", tagId: "ot-4", tagName: "최말자 님", hubId: "oh-rest", hubName: "3층 휴게실 허브", zone: "3층 휴게실", signalStrength: 77, timestamp: iso(now, 8) },
    { id: "ol-3", tagId: "ot-5", tagName: "윤정희 님", hubId: "oh-living2-b", hubName: "2층 생활실 허브 B", zone: "2층 생활실", signalStrength: 69, timestamp: iso(now, 13) },
    { id: "ol-4", tagId: "ot-1", tagName: "김영자 님", hubId: "oh-living2-a", hubName: "2층 생활실 허브 A", zone: "2층 생활실", signalStrength: 62, timestamp: iso(now, 22) },
    { id: "ol-5", tagId: "ot-2", tagName: "박순옥 님", hubId: "oh-med", hubName: "2층 복약함 허브", zone: "2층 복약함", signalStrength: 48, timestamp: iso(now, 47) },
  ];
}

export function personalNotifications(now: number): AppNotification[] {
  return [
    { id: "pn-1", ownerType: "personal", kind: "warn", title: "복약 미확인", body: "저녁 약 복용이 아직 확인되지 않았어요.", timestamp: iso(now, 18), read: false },
    { id: "pn-2", ownerType: "personal", kind: "danger", title: "장시간 무반응", body: "침실에서 20분 이상 움직임이 감지되지 않았어요.", timestamp: iso(now, 32), read: false },
    { id: "pn-3", ownerType: "personal", kind: "ok", title: "활동 감지", body: "거실에서 활동이 감지되었습니다.", timestamp: iso(now, 3), read: false },
    { id: "pn-4", ownerType: "personal", kind: "info", title: "외출 감지", body: "현관에서 외출 이벤트가 감지되었습니다.", timestamp: iso(now, 209), read: true },
    { id: "pn-5", ownerType: "personal", kind: "info", title: "보호자 확인 요청", body: "보호자 확인 요청이 전송되었습니다.", timestamp: iso(now, 24), read: true },
  ];
}

export function orgNotifications(now: number): AppNotification[] {
  return [
    { id: "on-1", ownerType: "organization", kind: "danger", title: "장시간 무반응", body: "김영자 님 · 20분 이상 무반응 · 2층 생활실", timestamp: iso(now, 22), read: false },
    { id: "on-2", ownerType: "organization", kind: "warn", title: "복약 미확인", body: "박순옥 님 · 저녁 약 미확인 · 복약함", timestamp: iso(now, 47), read: false },
    { id: "on-3", ownerType: "organization", kind: "warn", title: "귀가 확인 필요", body: "이정호 님 · 외출 후 미귀가 · 현관", timestamp: iso(now, 95), read: false },
    { id: "on-4", ownerType: "organization", kind: "danger", title: "허브 오프라인", body: "3층 생활실 허브가 오프라인 상태입니다.", timestamp: iso(now, 65), read: false },
    { id: "on-5", ownerType: "organization", kind: "ok", title: "담당자 확인 완료", body: "최말자 님의 활동 이벤트를 담당자가 확인했습니다.", timestamp: iso(now, 12), read: true },
  ];
}

export function personalCareEvents(now: number): CareEvent[] {
  return [
    { id: "pce-1", ownerType: "personal", type: "활동 감지", location: "거실", severity: "normal", guardianNotified: false, status: "confirmed", timestamp: iso(now, 3), description: "10:24 활동 감지 · 거실" },
    { id: "pce-2", ownerType: "personal", type: "복약 확인", location: "복약함", severity: "info", guardianNotified: false, status: "confirmed", timestamp: iso(now, 132), description: "08:15 약 보관함 열림 · 복약함" },
    { id: "pce-3", ownerType: "personal", type: "복약 확인", location: "복약함", severity: "normal", guardianNotified: true, status: "confirmed", timestamp: iso(now, 149), description: "07:58 약 복용 감지 · 복약함" },
    { id: "pce-4", ownerType: "personal", type: "활동 감지", location: "거실", severity: "normal", guardianNotified: false, status: "confirmed", timestamp: iso(now, 177), description: "07:30 활동 감지 · 거실" },
    { id: "pce-5", ownerType: "personal", type: "외출 감지", location: "현관", severity: "info", guardianNotified: true, status: "confirmed", timestamp: iso(now, 212), description: "06:55 외출 감지 · 현관" },
    { id: "pce-6", ownerType: "personal", type: "장시간 무반응", location: "침실", severity: "warning", guardianNotified: true, status: "resolved", timestamp: iso(now, 412), description: "침실에서 20분 이상 활동이 없어 확인 요청" },
    { id: "pce-7", ownerType: "personal", type: "낙상 의심", location: "거실", severity: "critical", guardianNotified: true, status: "resolved", timestamp: iso(now, 1440), description: "평소와 다른 급격한 신호 변화가 감지됨" },
    { id: "pce-8", ownerType: "personal", type: "귀가 감지", location: "현관", severity: "info", guardianNotified: false, status: "confirmed", timestamp: iso(now, 1530), description: "현관에서 귀가 이벤트 감지" },
  ];
}

export function organizationCareEvents(now: number): CareEvent[] {
  return [
    { id: "oce-1", ownerType: "organization", personName: "김영자 님", type: "장시간 무반응", location: "2층 생활실", severity: "critical", guardianNotified: true, status: "checking", timestamp: iso(now, 22), description: "20분 이상 활동이 감지되지 않았습니다." },
    { id: "oce-2", ownerType: "organization", personName: "박순옥 님", type: "복약 미확인", location: "2층 복약함", severity: "warning", guardianNotified: true, status: "new", timestamp: iso(now, 47), description: "저녁 약통 사용이 아직 확인되지 않았습니다." },
    { id: "oce-3", ownerType: "organization", personName: "이정호 님", type: "보호자 확인 요청", location: "1층 현관", severity: "warning", guardianNotified: true, status: "checking", timestamp: iso(now, 95), description: "외출 후 평소 귀가 시간이 지났습니다." },
    { id: "oce-4", ownerType: "organization", type: "허브 오프라인", location: "3층 생활실", severity: "critical", guardianNotified: false, status: "new", timestamp: iso(now, 65), description: "3층 생활실 허브 연결을 확인해주세요." },
    { id: "oce-5", ownerType: "organization", personName: "최말자 님", type: "활동 감지", location: "3층 휴게실", severity: "normal", guardianNotified: false, status: "confirmed", timestamp: iso(now, 8), description: "평소 오전 활동 패턴과 유사합니다." },
    { id: "oce-6", ownerType: "organization", personName: "한복례 님", type: "귀가 감지", location: "1층 현관", severity: "info", guardianNotified: false, status: "confirmed", timestamp: iso(now, 18), description: "정상 귀가 이벤트가 확인되었습니다." },
    { id: "oce-7", ownerType: "organization", personName: "윤정희 님", type: "복약 확인", location: "2층 복약함", severity: "normal", guardianNotified: false, status: "confirmed", timestamp: iso(now, 33), description: "아침 복약이 확인되었습니다." },
    { id: "oce-8", ownerType: "organization", personName: "서영수 님", type: "담당자 확인 완료", location: "2층 생활실", severity: "info", guardianNotified: true, status: "resolved", timestamp: iso(now, 74), description: "담당자 전화 확인이 완료되었습니다." },
  ];
}

export function orgMembers(): OrgMember[] {
  return [
    { id: "m-1", name: "노수아", email: "sua.noh@bomi.care", role: "admin", zones: "전체", status: "active" },
    { id: "m-2", name: "이수진", email: "sujin.lee@bomi.care", role: "manager", zones: "2층 생활실 · 복약함", status: "active" },
    { id: "m-3", name: "박민아", email: "mina.park@bomi.care", role: "staff", zones: "2층 복약함", status: "active" },
    { id: "m-4", name: "정현우", email: "hyunwoo.jung@bomi.care", role: "staff", zones: "1층 현관 · 2층 생활실", status: "active" },
    { id: "m-5", name: "한서윤", email: "seoyoon.han@bomi.care", role: "manager", zones: "3층 생활실 · 휴게실", status: "active" },
    { id: "m-6", name: "김다은", email: "daeun.kim@bomi.care", role: "viewer", zones: "3층 생활실", status: "invited" },
  ];
}

export const personalCategories = [
  "약통",
  "열쇠",
  "지갑",
  "외출가방",
  "휴대폰",
  "보조 안경",
  "복지카드",
  "기타 필수 물품",
];

export const orgCategories = [
  "생활 안전 관리",
  "집중 돌봄",
  "복약 관리",
  "방문돌봄",
  "주간보호",
];
