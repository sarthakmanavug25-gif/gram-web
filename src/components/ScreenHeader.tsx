"use client";

import { ReactNode } from "react";

export default function ScreenHeader({
  title,
  action,
  subtitle,
}: {
  title: string;
  action?: ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="mb-2 flex flex-col gap-3 pb-2 pt-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-[2.1rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-[14px] text-text-secondary">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

export function HeaderIconButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-green-primary/35 bg-green-primary/10 text-green-bright transition hover:bg-green-primary/18"
    >
      {children}
    </button>
  );
}
