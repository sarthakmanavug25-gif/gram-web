"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";

const spring = { type: "spring" as const, stiffness: 420, damping: 28, mass: 0.7 };

type Variant = "primary" | "secondary" | "ghost" | "solid-light";

type Common = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

export function MotionButton({
  children,
  className,
  variant = "primary",
  type = "button",
  onClick,
  disabled,
  ariaLabel,
}: Common & {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={clsx(btnClass(variant), className)}
    >
      {children}
    </motion.button>
  );
}

export function MotionLink({
  href,
  children,
  className,
  variant = "primary",
}: Common & { href: string }) {
  const classes = clsx(btnClass(variant), className, "inline-flex items-center justify-center");

  if (href.startsWith("#") || href.startsWith("/#")) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={spring}
        className={classes}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className="inline-flex"
    >
      <Link href={href} className={classes}>
        {children}
      </Link>
    </motion.div>
  );
}

function btnClass(variant: Variant) {
  return clsx(
    "btn-apple select-none rounded-full px-6 py-3 text-[15px] font-semibold will-change-transform",
    variant === "primary" &&
      "bg-green-primary text-white shadow-[0_10px_24px_rgba(31,122,69,0.28)]",
    variant === "solid-light" &&
      "bg-white text-[#102318] shadow-[0_10px_28px_rgba(0,0,0,0.18)]",
    variant === "secondary" &&
      "border border-white/40 bg-white/12 text-white backdrop-blur-xl",
    variant === "ghost" &&
      "border border-[var(--hairline-edge)] bg-white/40 text-text-primary backdrop-blur-xl"
  );
}
