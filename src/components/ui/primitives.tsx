"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx("card p-4", onClick && "cursor-pointer active:scale-[0.99] transition", className)}
    >
      {children}
    </div>
  );
}

export function SectionLabel({
  icon,
  children,
  color = "var(--green-bright)",
}: {
  icon?: ReactNode;
  children: ReactNode;
  color?: string;
}) {
  return (
    <div
      className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold"
      style={{ color }}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  color = "var(--green-primary)",
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition",
        active
          ? "text-black shadow-glow"
          : "hairline surface text-text-secondary hover-surface"
      )}
      style={active ? { backgroundColor: color } : undefined}
    >
      {children}
    </button>
  );
}

export function Tag({
  children,
  color,
  tint,
}: {
  children: ReactNode;
  color: string;
  tint: string;
}) {
  return (
    <span
      className="rounded-full px-2 py-[3px] text-[11px] font-semibold"
      style={{ color, backgroundColor: tint }}
    >
      {children}
    </span>
  );
}

export function IconTile({
  children,
  color,
  tint,
  size = 40,
}: {
  children: ReactNode;
  color: string;
  tint: string;
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl"
      style={{ width: size, height: size, backgroundColor: tint, color }}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex w-full items-center justify-center gap-2 rounded-full bg-green-primary px-5 py-3.5 text-[15px] font-bold text-white transition",
        "hover:bg-green-dark hover:shadow-glow disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex w-full items-center justify-center gap-2 rounded-full hairline surface px-5 py-3.5 text-[15px] font-semibold text-text-primary transition hover-surface",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton rounded-xl", className)} />;
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <div className="mb-1 text-text-muted">{icon}</div>
      <p className="text-[15px] font-semibold">{title}</p>
      <p className="max-w-[280px] text-[13px] text-text-secondary">{body}</p>
      {action}
    </div>
  );
}

export function ProgressBar({
  value,
  color,
  height = 8,
}: {
  value: number;
  color: string;
  height?: number;
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-full surface-2"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.max(2, Math.min(100, value))}%`, backgroundColor: color }}
      />
    </div>
  );
}
