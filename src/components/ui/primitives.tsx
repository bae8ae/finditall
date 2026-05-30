"use client";

import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
  useEffect,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------- Button ------------------------------- */

type Variant = "primary" | "mint" | "ghost" | "outline" | "danger" | "subtle";
type Size = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-pink to-pink-soft text-white shadow-lg shadow-pink/20 hover:brightness-110",
  mint: "bg-gradient-to-br from-mint to-mint-soft text-[#04221c] font-semibold shadow-lg shadow-mint/20 hover:brightness-105",
  ghost: "text-muted hover:text-text hover:bg-surface-2",
  outline: "border border-border bg-surface/60 text-text hover:bg-surface-2 hover:border-border",
  danger: "bg-danger/15 text-danger border border-danger/40 hover:bg-danger/25",
  subtle: "bg-surface-2 text-text hover:bg-border/60",
};
const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-9 w-9 justify-center",
};

export function Button({
  variant = "outline",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center rounded-lg font-medium transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* -------------------------------- Card -------------------------------- */

export function Card({
  className,
  children,
  ...rest
}: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass rounded-2xl border border-border-soft p-5",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  desc,
  icon,
  action,
}: {
  title: string;
  desc?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 grid size-9 place-items-center rounded-xl bg-surface-2 text-mint">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold tracking-tight text-text">{title}</h2>
          {desc && <p className="mt-0.5 text-sm text-muted">{desc}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------- Inputs ------------------------------- */

export function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted">
        {label}
        {required && <span className="text-pink">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted/70">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border border-border bg-bg-2/80 px-3 py-2 text-sm text-text placeholder:text-muted/60 outline-none transition focus:border-mint/70 focus:ring-2 focus:ring-mint/20";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(inputBase, "appearance-none", props.className)}>
      {props.children}
    </select>
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(inputBase, "min-h-[72px] resize-none", props.className)}
    />
  );
}

/* ------------------------------- Modal -------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  desc,
  children,
  size = "md",
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  desc?: string;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const w = size === "xl" ? "max-w-3xl" : size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "fit-pop glass relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-border-soft p-5 sm:rounded-2xl",
          w,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-text">{title}</h3>
            {desc && <p className="mt-1 text-sm text-muted">{desc}</p>}
          </div>
          <button
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-text"
            aria-label="닫기"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

/* -------------------------------- Stat -------------------------------- */

export function Stat({
  label,
  value,
  icon,
  tone = "default",
  sub,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "pink" | "mint" | "warn" | "danger";
  sub?: ReactNode;
}) {
  const tones: Record<string, string> = {
    default: "text-text",
    pink: "text-pink-soft",
    mint: "text-mint",
    warn: "text-warn",
    danger: "text-danger",
  };
  const ring: Record<string, string> = {
    default: "bg-surface-2 text-muted",
    pink: "bg-pink/10 text-pink-soft",
    mint: "bg-mint/10 text-mint",
    warn: "bg-warn/10 text-warn",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <Card className="flex items-center gap-4 p-4">
      {icon && (
        <div className={cn("grid size-11 shrink-0 place-items-center rounded-xl", ring[tone])}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-muted">{label}</p>
        <p className={cn("text-2xl font-bold leading-tight", tones[tone])}>{value}</p>
        {sub && <p className="mt-0.5 text-[11px] text-muted">{sub}</p>}
      </div>
    </Card>
  );
}

/* ------------------------------ Pill / chip ------------------------------ */

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-mint/50 bg-mint/15 text-mint"
          : "border-border bg-surface/50 text-muted hover:text-text",
      )}
    >
      {children}
    </button>
  );
}
