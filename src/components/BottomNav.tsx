"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, CloudSun, Home, IndianRupee, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { useT, type StringKey } from "@/lib/i18n";

const ITEMS: { href: string; label: StringKey; icon: typeof Home }[] = [
  { href: "/", label: "nav.home", icon: Home },
  { href: "/crop-doctor", label: "nav.cropDoctor", icon: Camera },
  { href: "/advisor", label: "nav.advisor", icon: CloudSun },
  { href: "/expenses", label: "nav.expenses", icon: IndianRupee },
  { href: "/more", label: "nav.more", icon: MoreHorizontal },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useT();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(12px,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto mx-3 flex w-full max-w-phone items-center justify-between gap-1 rounded-[26px] hairline nav-surface px-2 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 px-1 py-0.5"
            >
              <span
                className={clsx(
                  "flex h-8 w-10 items-center justify-center rounded-xl transition",
                  active ? "bg-green-primary/20" : "hover:surface"
                )}
              >
                <Icon
                  size={19}
                  strokeWidth={2.2}
                  className={active ? "text-green-bright" : "text-text-secondary"}
                />
              </span>
              <span
                className={clsx(
                  "text-[10px] font-semibold leading-none",
                  active ? "text-green-bright" : "text-text-secondary"
                )}
              >
                {t(label)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
