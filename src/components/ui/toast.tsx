"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn, uid } from "@/lib/utils";

type ToastKind = "success" | "error" | "info" | "warn";
interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  desc?: string;
}

const ToastContext = createContext<{
  toast: (t: Omit<Toast, "id">) => void;
} | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warn: AlertTriangle,
};
const TONES = {
  success: "text-mint border-mint/40",
  error: "text-danger border-danger/40",
  info: "text-info border-info/40",
  warn: "text-warn border-warn/40",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = uid("toast");
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => remove(id), 3800);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <div
              key={t.id}
              className={cn(
                "glass fit-pop flex items-start gap-3 rounded-xl border p-3 shadow-lg shadow-black/40",
                TONES[t.kind],
              )}
            >
              <Icon className="mt-0.5 size-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text">{t.title}</p>
                {t.desc && (
                  <p className="mt-0.5 text-xs text-muted">{t.desc}</p>
                )}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="text-muted transition hover:text-text"
                aria-label="닫기"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}
