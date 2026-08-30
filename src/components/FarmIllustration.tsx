"use client";

import { motion } from "framer-motion";

/** Animated field scene shown above the login form. */
export default function FarmIllustration() {
  return (
    <svg
      viewBox="0 0 320 150"
      className="h-[132px] w-full"
      role="img"
      aria-label="Sunrise over a green field"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f2a18" stopOpacity="0" />
          <stop offset="100%" stopColor="#0f2a18" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <linearGradient id="fieldFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>

      <rect width="320" height="150" fill="url(#sky)" />

      <motion.g
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <circle cx="238" cy="52" r="20" fill="#fbbf24" opacity="0.95" />
        <circle cx="238" cy="52" r="30" fill="#fbbf24" opacity="0.16" />
      </motion.g>

      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={i}
          cx={60 + i * 92}
          cy={38 + (i % 2) * 14}
          rx="26"
          ry="7"
          fill="#ffffff"
          opacity="0.12"
          animate={{ x: [0, 14, 0] }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <path
        d="M0 96 C 60 84, 110 100, 170 92 C 230 84, 280 96, 320 88 L320 150 L0 150 Z"
        fill="url(#fieldFar)"
        opacity="0.55"
      />
      <path
        d="M0 112 C 70 100, 130 118, 200 108 C 260 100, 300 112, 320 106 L320 150 L0 150 Z"
        fill="url(#field)"
      />

      {[26, 58, 90, 122, 154, 186, 218, 250, 282, 306].map((x, i) => (
        <motion.g
          key={x}
          style={{ originX: `${x}px`, originY: "132px" }}
          animate={{ rotate: [-3, 3, -3] }}
          transition={{
            duration: 3.5 + (i % 3) * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.12,
          }}
        >
          <path
            d={`M${x} 134 L${x} 118`}
            stroke="#065f46"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d={`M${x} 122 q -7 -6 -11 -1 q 5 6 11 1`}
            fill="#4ade80"
            opacity="0.9"
          />
          <path
            d={`M${x} 126 q 7 -6 11 -1 q -5 6 -11 1`}
            fill="#22c55e"
            opacity="0.9"
          />
        </motion.g>
      ))}
    </svg>
  );
}
