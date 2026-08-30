"use client";

import { ReactNode } from "react";

export default function ScreenHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-center justify-between pb-1 pt-2">
      <h1 className="text-[30px] font-bold leading-tight tracking-tight">
        {title}
      </h1>
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-green-primary/40 bg-green-primary/10 text-green-bright transition hover:bg-green-primary/20"
    >
      {children}
    </button>
  );
}
