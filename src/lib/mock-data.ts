import type {
  Tag,
  Hub,
  Zone,
  DetectionLog,
  AppNotification,
  OrgMember,
} from "./types";

const iso = (now: number, minutesAgo: number) =>
  new Date(now - minutesAgo * 60000).toISOString();

/* ----------------------------- ZONES ----------------------------- */

export function personalZones(): Zone[] {
  return [
    { id: "pz-entry", name: "현관", type: "home", floor: "1F", description: "출입구 · 신발장", hubIds: ["ph-entry"], ownerType: "personal", col: 0, row: 1, w: 1, h: 1 },
    { id: "pz-living", name: "거실", type: "home", floor: "1F", description: "소파 · TV 주변", hubIds: ["ph-living"], ownerType: "personal", col: 1, row: 0, w: 2, h: 2 },
    { id: "pz-kitchen", name: "주방", type: "home", floor: "1F", description: "식탁 · 조리대", hubIds: [], ownerType: "personal", col: 3, row: 0, w: 1, h: 1 },
    { id: "pz-bed", name: "침실", type: "home", floor: "1F", description: "침대 · 협탁", hubIds: ["ph-bed"], ownerType: "personal", col: 0, row: 0, w: 1, h: 1 },
    { id: "pz-study", name: "서재", type: "home", floor: "1F", description: "책상 · 책장", hubIds: ["ph-study"], ownerType: "personal", col: 3, row: 1, w: 1, h: 1 },
  ];
}

export function orgZones(): Zone[] {
  return [
    { id: "oz-lobby", name: "1층 로비", type: "hospital", floor: "1F", description: "메인 출입 · 안내데스크", hubIds: ["oh-lobby"], ownerType: "organization", col: 0, row: 0, w: 2, h: 1 },
    { id: "oz-ward", name: "2층 병동", type: "hospital", floor: "2F", description: "입원 병동 · 간호스테이션", hubIds: ["oh-ward-a", "oh-ward-b"], ownerType: "organization", col: 2, row: 0, w: 2, h: 1 },
    { id: "oz-exam", name: "3층 검사실", type: "hospital", floor: "3F", description: "영상 · 진단 장비실", hubIds: ["oh-exam"], ownerType: "organization", col: 0, row: 1, w: 1, h: 1 },
    { id: "oz-labA", name: "연구실 A", type: "lab", floor: "3F", description: "공용 실험 장비", hubIds: ["oh-labA"], ownerType: "organization", col: 1, row: 1, w: 1, h: 1 },
    { id: "oz-labB", name: "연구실 B", type: "lab", floor: "3F", description: "시약 · 정밀 키트", hubIds: ["oh-labB"], ownerType: "organization", col: 2, row: 1, w: 1, h: 1 },
    { id: "oz-storage", name: "장비 보관실", type: "office", floor: "B1", description: "공용 자산 보관", hubIds: ["oh-storage"], ownerType: "organization", col: 3, row: 1, w: 1, h: 1 },
    { id: "oz-meeting", name: "회의실", type: "office", floor: "1F", description: "대회의실 · 비품", hubIds: ["oh-meeting"], ownerType: "organization", col: 0, row: 2, w: 2, h: 1 },
    { id: "oz-warehouse", name: "창고", type: "office", floor: "B1", description: "행사 · 예비 자산", hubIds: [], ownerType: "organization", col: 2, row: 2, w: 2, h: 1 },
  ];
}

/* ----------------------------- HUBS ----------------------------- */

export function personalHubs(now: number): Hub[] {
  return [
    { id: "ph-living", name: "거실 허브", zone: "거실", zoneId: "pz-living", status: "online", connectedTagsCount: 4, coverageRadius: 8, lastSyncAt: iso(now, 1), ownerType: "personal" },
    { id: "ph-bed", name: "침실 허브", zone: "침실", zoneId: "pz-bed", status: "online", connectedTagsCount: 2, coverageRadius: 6, lastSyncAt: iso(now, 3), ownerType: "personal" },
    { id: "ph-entry", name: "현관 허브", zone: "현관", zoneId: "pz-entry", status: "online", connectedTagsCount: 2, coverageRadius: 5, lastSyncAt: iso(now, 2), ownerType: "personal" },
    { id: "ph-study", name: "서재 허브", zone: "서재", zoneId: "pz-study", status: "offline", connectedTagsCount: 0, coverageRadius: 6, lastSyncAt: iso(now, 142), ownerType: "personal" },
  ];
}

export function orgHubs(now: number): Hub[] {
  return [
    { id: "oh-lobby", name: "로비 허브", zone: "1층 로비", zoneId: "oz-lobby", status: "online", connectedTagsCount: 6, coverageRadius: 14, lastSyncAt: iso(now, 1), ownerType: "organization" },
    { id: "oh-ward-a", name: "2층 병동 허브 A", zone: "2층 병동", zoneId: "oz-ward", status: "online", connectedTagsCount: 9, coverageRadius: 12, lastSyncAt: iso(now, 1), ownerType: "organization" },
    { id: "oh-ward-b", name: "2층 병동 허브 B", zone: "2층 병동", zoneId: "oz-ward", status: "warning", connectedTagsCount: 5, coverageRadius: 12, lastSyncAt: iso(now, 17), ownerType: "organization" },
    { id: "oh-exam", name: "검사실 허브", zone: "3층 검사실", zoneId: "oz-exam", status: "online", connectedTagsCount: 4, coverageRadius: 10, lastSyncAt: iso(now, 2), ownerType: "organization" },
    { id: "oh-labA", name: "연구실 A 허브", zone: "연구실 A", zoneId: "oz-labA", status: "online", connectedTagsCount: 7, coverageRadius: 9, lastSyncAt: iso(now, 3), ownerType: "organization" },
    { id: "oh-labB", name: "연구실 B 허브", zone: "연구실 B", zoneId: "oz-labB", status: "offline", connectedTagsCount: 0, coverageRadius: 9, lastSyncAt: iso(now, 220), ownerType: "organization" },
    { id: "oh-storage", name: "보관실 허브", zone: "장비 보관실", zoneId: "oz-storage", status: "online", connectedTagsCount: 11, coverageRadius: 16, lastSyncAt: iso(now, 4), ownerType: "organization" },
    { id: "oh-meeting", name: "회의실 허브", zone: "회의실", zoneId: "oz-meeting", status: "online", connectedTagsCount: 3, coverageRadius: 8, lastSyncAt: iso(now, 6), ownerType: "organization" },
  ];
}

/* ----------------------------- TAGS ----------------------------- */

export function personalTags(now: number): Tag[] {
  return [
    { id: "pt-1", tagCode: "TAG-A001", name: "지갑", category: "지갑", ownerType: "personal", status: "normal", lastDetectedZone: "현관", lastDetectedHub: "현관 허브", signalStrength: 82, lastDetectedAt: iso(now, 4), batteryType: "Batteryless", icon: "wallet", notes: "갈색 가죽 반지갑", homeZoneId: "pz-entry" },
    { id: "pt-2", tagCode: "TAG-A002", name: "자동차 열쇠", category: "열쇠", ownerType: "personal", status: "normal", lastDetectedZone: "현관", lastDetectedHub: "현관 허브", signalStrength: 74, lastDetectedAt: iso(now, 6), batteryType: "Batteryless", icon: "key", notes: "", homeZoneId: "pz-entry" },
    { id: "pt-3", tagCode: "TAG-A003", name: "TV 리모컨", category: "리모컨", ownerType: "personal", status: "lowSignal", lastDetectedZone: "거실", lastDetectedHub: "거실 허브", signalStrength: 31, lastDetectedAt: iso(now, 38), batteryType: "Batteryless", icon: "tv", notes: "소파 쿠션 사이에 자주 들어감", homeZoneId: "pz-living" },
    { id: "pt-4", tagCode: "TAG-A004", name: "안경 케이스", category: "안경 케이스", ownerType: "personal", status: "normal", lastDetectedZone: "침실", lastDetectedHub: "침실 허브", signalStrength: 68, lastDetectedAt: iso(now, 11), batteryType: "Batteryless", icon: "glasses", notes: "", homeZoneId: "pz-bed" },
    { id: "pt-5", tagCode: "TAG-A005", name: "스마트폰", category: "스마트폰", ownerType: "personal", status: "normal", lastDetectedZone: "거실", lastDetectedHub: "거실 허브", signalStrength: 90, lastDetectedAt: iso(now, 1), batteryType: "Batteryless", icon: "smartphone", notes: "Guest Find 허용됨", homeZoneId: "pz-living" },
    { id: "pt-6", tagCode: "TAG-A006", name: "사원증", category: "학생증/사원증", ownerType: "personal", status: "normal", lastDetectedZone: "서재", lastDetectedHub: "서재 허브", signalStrength: 55, lastDetectedAt: iso(now, 64), batteryType: "Batteryless", icon: "id-card", notes: "", homeZoneId: "pz-study" },
    { id: "pt-7", tagCode: "TAG-A007", name: "약통", category: "약통", ownerType: "personal", status: "normal", lastDetectedZone: "주방", lastDetectedHub: "거실 허브", signalStrength: 47, lastDetectedAt: iso(now, 22), batteryType: "Batteryless", icon: "pill", notes: "아침 복용", homeZoneId: "pz-kitchen" },
    { id: "pt-8", tagCode: "TAG-A008", name: "여권 서류함", category: "서류/파일", ownerType: "personal", status: "missing", lastDetectedZone: "서재", lastDetectedHub: "서재 허브", signalStrength: 0, lastDetectedAt: iso(now, 1680), batteryType: "Batteryless", icon: "folder", notes: "28시간 동안 미감지", homeZoneId: "pz-study" },
    { id: "pt-9", tagCode: "TAG-A009", name: "보조 열쇠", category: "열쇠", ownerType: "personal", status: "normal", lastDetectedZone: "침실", lastDetectedHub: "침실 허브", signalStrength: 61, lastDetectedAt: iso(now, 18), batteryType: "Batteryless", icon: "key", notes: "", homeZoneId: "pz-bed" },
    { id: "pt-10", tagCode: "TAG-A010", name: "에어팟 케이스", category: "기타", ownerType: "personal", status: "lowSignal", lastDetectedZone: "거실", lastDetectedHub: "거실 허브", signalStrength: 28, lastDetectedAt: iso(now, 52), batteryType: "Batteryless", icon: "headphones", notes: "", homeZoneId: "pz-living" },
  ];
}

export function orgTags(now: number): Tag[] {
  return [
    { id: "ot-1", tagCode: "TAG-H101", name: "휠체어 3번", category: "휠체어", ownerType: "organization", status: "normal", lastDetectedZone: "2층 병동", lastDetectedHub: "2층 병동 허브 A", signalStrength: 78, lastDetectedAt: iso(now, 5), batteryType: "Batteryless", icon: "armchair", department: "간호부", assignee: "김수진", importance: "high", homeZoneId: "oz-ward", notes: "" },
    { id: "ot-2", tagCode: "TAG-H102", name: "이동식 초음파기", category: "이동식 의료기기", ownerType: "organization", status: "normal", lastDetectedZone: "3층 검사실", lastDetectedHub: "검사실 허브", signalStrength: 71, lastDetectedAt: iso(now, 9), batteryType: "Batteryless", icon: "activity", department: "영상의학과", assignee: "박준호", importance: "high", homeZoneId: "oz-exam", notes: "정밀 장비" },
    { id: "ot-3", tagCode: "TAG-H103", name: "공용 태블릿 A12", category: "공용 태블릿", ownerType: "organization", status: "searching", lastDetectedZone: "1층 로비", lastDetectedHub: "로비 허브", signalStrength: 44, lastDetectedAt: iso(now, 3), batteryType: "Batteryless", icon: "tablet", department: "원무팀", assignee: "이가람", importance: "normal", homeZoneId: "oz-ward", notes: "지정 구역 이탈 감지" },
    { id: "ot-4", tagCode: "TAG-H104", name: "약품 카트 2호", category: "약품 카트", ownerType: "organization", status: "normal", lastDetectedZone: "2층 병동", lastDetectedHub: "2층 병동 허브 B", signalStrength: 66, lastDetectedAt: iso(now, 14), batteryType: "Batteryless", icon: "package", department: "약제부", assignee: "정민아", importance: "high", homeZoneId: "oz-ward", notes: "" },
    { id: "ot-5", tagCode: "TAG-H105", name: "청소 장비 세트", category: "청소 장비", ownerType: "organization", status: "normal", lastDetectedZone: "1층 로비", lastDetectedHub: "로비 허브", signalStrength: 58, lastDetectedAt: iso(now, 26), batteryType: "Batteryless", icon: "brush", department: "환경미화", assignee: "최영수", importance: "low", homeZoneId: "oz-lobby", notes: "" },
    { id: "ot-6", tagCode: "TAG-L201", name: "원심분리기", category: "실험 장비", ownerType: "organization", status: "normal", lastDetectedZone: "연구실 A", lastDetectedHub: "연구실 A 허브", signalStrength: 81, lastDetectedAt: iso(now, 7), batteryType: "Batteryless", icon: "flask-conical", department: "연구1팀", assignee: "한지우", importance: "high", homeZoneId: "oz-labA", notes: "" },
    { id: "ot-7", tagCode: "TAG-L202", name: "시약 박스 7", category: "시약 박스", ownerType: "organization", status: "lowSignal", lastDetectedZone: "연구실 B", lastDetectedHub: "연구실 B 허브", signalStrength: 24, lastDetectedAt: iso(now, 96), batteryType: "Batteryless", icon: "boxes", department: "연구2팀", assignee: "오세림", importance: "normal", homeZoneId: "oz-labB", notes: "허브 오프라인 영향" },
    { id: "ot-8", tagCode: "TAG-L203", name: "공용 키트 03", category: "공용 키트", ownerType: "organization", status: "normal", lastDetectedZone: "연구실 A", lastDetectedHub: "연구실 A 허브", signalStrength: 63, lastDetectedAt: iso(now, 19), batteryType: "Batteryless", icon: "briefcase", department: "연구1팀", assignee: "한지우", importance: "normal", homeZoneId: "oz-labA", notes: "" },
    { id: "ot-9", tagCode: "TAG-L204", name: "연구용 노트북 N4", category: "노트북", ownerType: "organization", status: "normal", lastDetectedZone: "연구실 A", lastDetectedHub: "연구실 A 허브", signalStrength: 70, lastDetectedAt: iso(now, 12), batteryType: "Batteryless", icon: "laptop", department: "연구1팀", assignee: "서동현", importance: "normal", homeZoneId: "oz-labA", notes: "" },
    { id: "ot-10", tagCode: "TAG-S301", name: "공용 노트북 12", category: "공용 노트북", ownerType: "organization", status: "normal", lastDetectedZone: "장비 보관실", lastDetectedHub: "보관실 허브", signalStrength: 75, lastDetectedAt: iso(now, 8), batteryType: "Batteryless", icon: "laptop", department: "총무팀", assignee: "윤하늘", importance: "normal", homeZoneId: "oz-storage", notes: "" },
    { id: "ot-11", tagCode: "TAG-S302", name: "프로젝터 B", category: "프로젝터", ownerType: "organization", status: "normal", lastDetectedZone: "회의실", lastDetectedHub: "회의실 허브", signalStrength: 67, lastDetectedAt: iso(now, 33), batteryType: "Batteryless", icon: "projector", department: "총무팀", assignee: "윤하늘", importance: "normal", homeZoneId: "oz-meeting", notes: "" },
    { id: "ot-12", tagCode: "TAG-S303", name: "촬영 장비 케이스 B07", category: "촬영 장비", ownerType: "organization", status: "missing", lastDetectedZone: "장비 보관실", lastDetectedHub: "보관실 허브", signalStrength: 0, lastDetectedAt: iso(now, 2880), batteryType: "Batteryless", icon: "camera", department: "홍보팀", assignee: "강태리", importance: "high", homeZoneId: "oz-storage", notes: "48시간 미감지 · 분실 의심" },
    { id: "ot-13", tagCode: "TAG-S304", name: "행사 음향 장비", category: "행사 장비", ownerType: "organization", status: "normal", lastDetectedZone: "장비 보관실", lastDetectedHub: "보관실 허브", signalStrength: 52, lastDetectedAt: iso(now, 41), batteryType: "Batteryless", icon: "speaker", department: "총무팀", assignee: "윤하늘", importance: "low", homeZoneId: "oz-storage", notes: "" },
    { id: "ot-14", tagCode: "TAG-T401", name: "마스터키 세트", category: "마스터키", ownerType: "organization", status: "normal", lastDetectedZone: "1층 로비", lastDetectedHub: "로비 허브", signalStrength: 88, lastDetectedAt: iso(now, 2), batteryType: "Batteryless", icon: "key-round", department: "운영팀", assignee: "노수아", importance: "high", homeZoneId: "oz-lobby", notes: "반출 시 즉시 알림" },
    { id: "ot-15", tagCode: "TAG-T402", name: "무전기 5번", category: "무전기", ownerType: "organization", status: "lowSignal", lastDetectedZone: "회의실", lastDetectedHub: "회의실 허브", signalStrength: 35, lastDetectedAt: iso(now, 58), batteryType: "Batteryless", icon: "radio", department: "운영팀", assignee: "노수아", importance: "normal", homeZoneId: "oz-meeting", notes: "" },
    { id: "ot-16", tagCode: "TAG-H106", name: "공용 태블릿 A13", category: "공용 태블릿", ownerType: "organization", status: "normal", lastDetectedZone: "2층 병동", lastDetectedHub: "2층 병동 허브 A", signalStrength: 72, lastDetectedAt: iso(now, 16), batteryType: "Batteryless", icon: "tablet", department: "원무팀", assignee: "이가람", importance: "normal", homeZoneId: "oz-ward", notes: "" },
  ];
}

/* --------------------------- DETECTION LOGS --------------------------- */

export function personalLogs(now: number): DetectionLog[] {
  return [
    { id: "pl-1", tagId: "pt-5", tagName: "스마트폰", hubId: "ph-living", hubName: "거실 허브", zone: "거실", signalStrength: 90, timestamp: iso(now, 1) },
    { id: "pl-2", tagId: "pt-1", tagName: "지갑", hubId: "ph-entry", hubName: "현관 허브", zone: "현관", signalStrength: 82, timestamp: iso(now, 4) },
    { id: "pl-3", tagId: "pt-2", tagName: "자동차 열쇠", hubId: "ph-entry", hubName: "현관 허브", zone: "현관", signalStrength: 74, timestamp: iso(now, 6) },
    { id: "pl-4", tagId: "pt-4", tagName: "안경 케이스", hubId: "ph-bed", hubName: "침실 허브", zone: "침실", signalStrength: 68, timestamp: iso(now, 11) },
    { id: "pl-5", tagId: "pt-9", tagName: "보조 열쇠", hubId: "ph-bed", hubName: "침실 허브", zone: "침실", signalStrength: 61, timestamp: iso(now, 18) },
    { id: "pl-6", tagId: "pt-7", tagName: "약통", hubId: "ph-living", hubName: "거실 허브", zone: "주방", signalStrength: 47, timestamp: iso(now, 22) },
    { id: "pl-7", tagId: "pt-3", tagName: "TV 리모컨", hubId: "ph-living", hubName: "거실 허브", zone: "거실", signalStrength: 31, timestamp: iso(now, 38) },
  ];
}

export function orgLogs(now: number): DetectionLog[] {
  const out: DetectionLog[] = [];
  const base: [string, string, string, string, number][] = [
    ["ot-14", "마스터키 세트", "oh-lobby", "로비 허브", 88],
    ["ot-6", "원심분리기", "oh-labA", "연구실 A 허브", 81],
    ["ot-1", "휠체어 3번", "oh-ward-a", "2층 병동 허브 A", 78],
    ["ot-10", "공용 노트북 12", "oh-storage", "보관실 허브", 75],
    ["ot-16", "공용 태블릿 A13", "oh-ward-a", "2층 병동 허브 A", 72],
    ["ot-2", "이동식 초음파기", "oh-exam", "검사실 허브", 71],
    ["ot-9", "연구용 노트북 N4", "oh-labA", "연구실 A 허브", 70],
    ["ot-3", "공용 태블릿 A12", "oh-lobby", "로비 허브", 44],
  ];
  const zoneByHub: Record<string, string> = {
    "oh-lobby": "1층 로비",
    "oh-labA": "연구실 A",
    "oh-ward-a": "2층 병동",
    "oh-storage": "장비 보관실",
    "oh-exam": "3층 검사실",
  };
  base.forEach((b, i) => {
    out.push({
      id: `ol-${i + 1}`,
      tagId: b[0],
      tagName: b[1],
      hubId: b[2],
      hubName: b[3],
      zone: zoneByHub[b[2]] ?? "—",
      signalStrength: b[4],
      timestamp: iso(now, 2 + i * 6),
    });
  });
  return out;
}

/* --------------------------- NOTIFICATIONS --------------------------- */

export function personalNotifications(now: number): AppNotification[] {
  return [
    { id: "pn-1", ownerType: "personal", kind: "info", title: "지갑 위치 업데이트", body: "지갑이 현관 허브에서 마지막으로 감지되었습니다.", timestamp: iso(now, 4), read: false },
    { id: "pn-2", ownerType: "personal", kind: "danger", title: "리모컨 미감지", body: "TV 리모컨 신호가 약합니다. 거실 허브 근처를 확인해보세요.", timestamp: iso(now, 38), read: false },
    { id: "pn-3", ownerType: "personal", kind: "warn", title: "허브 오프라인", body: "서재 허브가 오프라인 상태입니다. 전원과 네트워크를 확인하세요.", timestamp: iso(now, 142), read: false },
    { id: "pn-4", ownerType: "personal", kind: "danger", title: "분실 의심", body: "여권 서류함이 24시간 이상 감지되지 않았습니다.", timestamp: iso(now, 1680), read: true },
    { id: "pn-5", ownerType: "personal", kind: "ok", title: "찾음 처리", body: "안경 케이스를 찾음 처리했습니다.", timestamp: iso(now, 300), read: true },
  ];
}

export function orgNotifications(now: number): AppNotification[] {
  return [
    { id: "on-1", ownerType: "organization", kind: "warn", title: "구역 이탈", body: "휠체어 3번이 2층 병동에서 1층 로비로 이동했습니다.", timestamp: iso(now, 5), read: false },
    { id: "on-2", ownerType: "organization", kind: "danger", title: "지정 구역 밖 감지", body: "공용 태블릿 A12가 지정 구역 밖에서 감지되었습니다.", timestamp: iso(now, 3), read: false },
    { id: "on-3", ownerType: "organization", kind: "danger", title: "장기 미감지", body: "촬영 장비 케이스 B07이 48시간 동안 감지되지 않았습니다.", timestamp: iso(now, 120), read: false },
    { id: "on-4", ownerType: "organization", kind: "warn", title: "허브 이상", body: "연구실 B 허브가 오프라인 상태입니다. 시약 박스 7 신호가 약합니다.", timestamp: iso(now, 220), read: false },
    { id: "on-5", ownerType: "organization", kind: "info", title: "허브 경고", body: "2층 병동 허브 B의 동기화가 지연되고 있습니다.", timestamp: iso(now, 17), read: true },
  ];
}

/* --------------------------- ORG MEMBERS --------------------------- */

export function orgMembers(): OrgMember[] {
  return [
    { id: "m-1", name: "노수아", email: "sua.noh@findit.io", role: "admin", zones: "전체", status: "active" },
    { id: "m-2", name: "박준호", email: "junho.park@findit.io", role: "manager", zones: "3층 검사실 · 연구실 A/B", status: "active" },
    { id: "m-3", name: "김수진", email: "sujin.kim@findit.io", role: "staff", zones: "2층 병동", status: "active" },
    { id: "m-4", name: "이가람", email: "garam.lee@findit.io", role: "staff", zones: "1층 로비 · 2층 병동", status: "active" },
    { id: "m-5", name: "윤하늘", email: "haneul.yoon@findit.io", role: "manager", zones: "장비 보관실 · 회의실", status: "active" },
    { id: "m-6", name: "강태리", email: "taeri.kang@findit.io", role: "viewer", zones: "장비 보관실", status: "invited" },
    { id: "m-7", name: "오세림", email: "serim.oh@findit.io", role: "staff", zones: "연구실 B", status: "disabled" },
  ];
}

export const personalCategories = [
  "지갑", "열쇠", "리모컨", "안경 케이스", "스마트폰",
  "학생증/사원증", "약통", "서류/파일", "기타",
];

export const orgCategories = [
  "휠체어", "이동식 의료기기", "공용 태블릿", "약품 카트", "청소 장비",
  "실험 장비", "시약 박스", "공용 키트", "노트북", "장비 케이스",
  "마스터키", "청소 카트", "비품 박스", "무전기",
  "공용 노트북", "프로젝터", "촬영 장비", "행사 장비", "회의실 비품",
];
