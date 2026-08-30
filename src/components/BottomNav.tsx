"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, CloudSun, Home, IndianRupee, MoreHorizontal } from "lucide-react";
import clsx from "clsx";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/crop-doctor", label: "Crop Doctor", icon: Camera },
  { href: "/advisor", label: "Advisor", icon: CloudSun },
  { href: "/expenses", label: "Expenses", icon: IndianRupee },
  { href: "/more", label: "More", icon: MoreHorizontal },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(12px,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto mx-3 flex w-full max-w-phone items-center justify-between gap-1 rounded-[26px] border border-white/10 bg-[rgba(18,20,18,0.88)] px-2 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 transition",
                active ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
              )}
            >
              <Icon
                size={20}
                strokeWidth={2.2}
                className={active ? "text-green-bright" : "text-text-secondary"}
              />
              <span
                className={clsx(
                  "text-[10px] font-semibold leading-none",
                  active ? "text-green-bright" : "text-text-secondary"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
