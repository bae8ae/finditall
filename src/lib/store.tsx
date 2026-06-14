"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Tag,
  Hub,
  Zone,
  DetectionLog,
  AppNotification,
  OrgMember,
  TagStatus,
  OwnerType,
} from "./types";
import {
  personalTags,
  personalHubs,
  personalZones,
  personalLogs,
  personalNotifications,
  orgTags,
  orgHubs,
  orgZones,
  orgLogs,
  orgNotifications,
  orgMembers,
} from "./mock-data";
import { clamp, uid } from "./utils";

interface State {
  now: number;
  tags: Tag[];
  hubs: Hub[];
  zones: Zone[];
  logs: DetectionLog[];
  notifications: AppNotification[];
  members: OrgMember[];
}

function buildInitial(now: number): State {
  return {
    now,
    tags: [...personalTags(now), ...orgTags(now)],
    hubs: [...personalHubs(now), ...orgHubs(now)],
    zones: [...personalZones(), ...orgZones()],
    logs: [...personalLogs(now), ...orgLogs(now)],
    notifications: [...personalNotifications(now), ...orgNotifications(now)],
    members: orgMembers(),
  };
}

type Action =
  | { type: "HYDRATE"; state: State }
  | { type: "TICK"; now: number }
  | { type: "ADD_TAG"; tag: Tag }
  | { type: "UPDATE_TAG"; id: string; patch: Partial<Tag> }
  | { type: "ADD_LOG"; log: DetectionLog }
  | { type: "UPDATE_HUB"; id: string; patch: Partial<Hub> }
  | { type: "ADD_NOTIFICATION"; n: AppNotification }
  | { type: "MARK_READ"; ownerType: OwnerType }
  | { type: "UPDATE_MEMBER"; id: string; patch: Partial<OrgMember> }
  | { type: "ADD_MEMBER"; m: OrgMember }
  | { type: "DELETE_HUB"; id: string }
  | { type: "ADD_HUB"; hub: Hub };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "TICK":
      return { ...state, now: action.now };
    case "ADD_TAG":
      return { ...state, tags: [action.tag, ...state.tags] };
    case "UPDATE_TAG":
      return {
        ...state,
        tags: state.tags.map((t) =>
          t.id === action.id ? { ...t, ...action.patch } : t,
        ),
      };
    case "ADD_LOG":
      return { ...state, logs: [action.log, ...state.logs].slice(0, 200) };
    case "UPDATE_HUB":
      return {
        ...state,
        hubs: state.hubs.map((h) =>
          h.id === action.id ? { ...h, ...action.patch } : h,
        ),
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.n, ...state.notifications].slice(0, 80),
      };
    case "MARK_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.ownerType === action.ownerType ? { ...n, read: true } : n,
        ),
      };
    case "UPDATE_MEMBER":
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.id ? { ...m, ...action.patch } : m,
        ),
      };
    case "ADD_MEMBER":
      return { ...state, members: [action.m, ...state.members] };
    case "ADD_HUB":
      return { ...state, hubs: [...state.hubs, action.hub] };
    case "DELETE_HUB":
      return { ...state, hubs: state.hubs.filter((h) => h.id !== action.id) };
    default:
      return state;
  }
}

const STORAGE_KEY = "bomi-care-state-v1";

interface StoreApi {
  state: State;
  addTag: (t: Omit<Tag, "id" | "batteryType">) => void;
  updateTag: (id: string, patch: Partial<Tag>) => void;
  setTagStatus: (id: string, status: TagStatus) => void;
  markFound: (id: string) => void;
  reportMissing: (id: string) => void;
  addLog: (log: Omit<DetectionLog, "id" | "timestamp">) => void;
  rescanHub: (id: string) => void;
  addHub: (h: Omit<Hub, "id">) => void;
  deleteHub: (id: string) => void;
  updateHub: (id: string, patch: Partial<Hub>) => void;
  addNotification: (
    n: Omit<AppNotification, "id" | "timestamp" | "read">,
  ) => void;
  markRead: (ownerType: OwnerType) => void;
  addMember: (m: Omit<OrgMember, "id">) => void;
  updateMember: (id: string, patch: Partial<OrgMember>) => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, () =>
    buildInitial(Date.now()),
  );
  const loaded = useRef(false);

  // hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        if (parsed?.tags?.length) {
          dispatch({ type: "HYDRATE", state: { ...parsed, now: Date.now() } });
        }
      }
    } catch {
      /* ignore */
    }
    loaded.current = true;
  }, []);

  // persist
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  // background simulation: refresh "now" + gently jitter live signals
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "TICK", now: Date.now() });
    }, 15000);
    return () => clearInterval(id);
  }, []);

  const addTag = useCallback((t: Omit<Tag, "id" | "batteryType">) => {
    dispatch({
      type: "ADD_TAG",
      tag: { ...t, id: uid("tag"), batteryType: "Batteryless" },
    });
  }, []);

  const updateTag = useCallback((id: string, patch: Partial<Tag>) => {
    dispatch({ type: "UPDATE_TAG", id, patch });
  }, []);

  const setTagStatus = useCallback((id: string, status: TagStatus) => {
    dispatch({ type: "UPDATE_TAG", id, patch: { status } });
  }, []);

  const markFound = useCallback((id: string) => {
    dispatch({
      type: "UPDATE_TAG",
      id,
      patch: { status: "normal", signalStrength: 86, lastDetectedAt: new Date().toISOString() },
    });
  }, []);

  const reportMissing = useCallback((id: string) => {
    dispatch({
      type: "UPDATE_TAG",
      id,
      patch: { status: "missing", signalStrength: 0 },
    });
  }, []);

  const addLog = useCallback(
    (log: Omit<DetectionLog, "id" | "timestamp">) => {
      dispatch({
        type: "ADD_LOG",
        log: { ...log, id: uid("log"), timestamp: new Date().toISOString() },
      });
    },
    [],
  );

  const rescanHub = useCallback((id: string) => {
    dispatch({
      type: "UPDATE_HUB",
      id,
      patch: { status: "online", lastSyncAt: new Date().toISOString() },
    });
  }, []);

  const addHub = useCallback((h: Omit<Hub, "id">) => {
    dispatch({ type: "ADD_HUB", hub: { ...h, id: uid("hub") } });
  }, []);

  const deleteHub = useCallback((id: string) => {
    dispatch({ type: "DELETE_HUB", id });
  }, []);

  const updateHub = useCallback((id: string, patch: Partial<Hub>) => {
    dispatch({ type: "UPDATE_HUB", id, patch });
  }, []);

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "timestamp" | "read">) => {
      dispatch({
        type: "ADD_NOTIFICATION",
        n: { ...n, id: uid("ntf"), timestamp: new Date().toISOString(), read: false },
      });
    },
    [],
  );

  const markRead = useCallback((ownerType: OwnerType) => {
    dispatch({ type: "MARK_READ", ownerType });
  }, []);

  const addMember = useCallback((m: Omit<OrgMember, "id">) => {
    dispatch({ type: "ADD_MEMBER", m: { ...m, id: uid("m") } });
  }, []);

  const updateMember = useCallback((id: string, patch: Partial<OrgMember>) => {
    dispatch({ type: "UPDATE_MEMBER", id, patch });
  }, []);

  const api: StoreApi = {
    state,
    addTag,
    updateTag,
    setTagStatus,
    markFound,
    reportMissing,
    addLog,
    rescanHub,
    addHub,
    deleteHub,
    updateHub,
    addNotification,
    markRead,
    addMember,
    updateMember,
  };

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/* ----------------------------- selectors ----------------------------- */

export function useTags(ownerType: OwnerType) {
  const { state } = useStore();
  return state.tags.filter((t) => t.ownerType === ownerType);
}

export function useHubs(ownerType: OwnerType) {
  const { state } = useStore();
  return state.hubs.filter((h) => h.ownerType === ownerType);
}

export function useZones(ownerType: OwnerType) {
  const { state } = useStore();
  return state.zones.filter((z) => z.ownerType === ownerType);
}

export function useLogs(ownerType: OwnerType) {
  const { state } = useStore();
  const ids = new Set(
    state.tags.filter((t) => t.ownerType === ownerType).map((t) => t.id),
  );
  return state.logs.filter((l) => ids.has(l.tagId));
}

export function useNotifications(ownerType: OwnerType) {
  const { state } = useStore();
  return state.notifications.filter((n) => n.ownerType === ownerType);
}

export { clamp };
