"use client";

import { useMemo } from "react";

type Blade = {
  id: string;
  x: number;
  h: number;
  lean: number;
  w: number;
  tone: 0 | 1 | 2;
  dur: number;
  delay: number;
  amp: number;
};

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function makeBlades(
  count: number,
  yBase: number,
  width: number,
  seed: number,
  hMin: number,
  hMax: number,
): Blade[] {
  const out: Blade[] = [];
  for (let i = 0; i < count; i++) {
    const r1 = seeded(seed + i * 3.1);
    const r2 = seeded(seed + i * 7.7);
    const r3 = seeded(seed + i * 11.3);
    const r4 = seeded(seed + i * 19.9);
    const r5 = seeded(seed + i * 29.1);
    out.push({
      id: `${seed}-${i}`,
      x: (i / count) * width + (r1 - 0.5) * (width / count) * 1.4,
      h: hMin + r2 * (hMax - hMin),
      lean: (r3 - 0.5) * 10,
      w: 2.2 + r4 * 2.4,
      tone: (Math.floor(r5 * 3) % 3) as 0 | 1 | 2,
      dur: 2.6 + r2 * 2.8,
      delay: r1 * -4.5,
      amp: 5 + r3 * 7,
    });
  }
  return out;
}

const FILL = ["#1f6b38", "#2f8a48", "#46a85a"] as const;
const STROKE = ["#16532b", "#24703a", "#348a49"] as const;

function CropBlade({ b, y }: { b: Blade; y: number }) {
  const tipX = b.lean * 0.35;
  const midX = b.lean * 0.55;
  const leaf = b.h * 0.22;
  const amp = b.amp;
  return (
    <g transform={`translate(${b.x} ${y})`}>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={`${-amp};${amp};${-amp}`}
          keyTimes="0;0.5;1"
          dur={`${b.dur}s`}
          begin={`${b.delay}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
        />
        <path
          d={`M0 0 C ${midX * 0.4} ${-b.h * 0.35}, ${midX} ${-b.h * 0.7}, ${tipX} ${-b.h}`}
          fill="none"
          stroke={STROKE[b.tone]}
          strokeWidth={b.w * 0.55}
          strokeLinecap="round"
        />
        <path
          d={`M${midX * 0.35} ${-b.h * 0.42}
             C ${midX * 0.35 - leaf} ${-b.h * 0.5}, ${midX * 0.35 - leaf * 1.1} ${-b.h * 0.62}, ${midX * 0.2} ${-b.h * 0.58}
             C ${midX * 0.35 - leaf * 0.3} ${-b.h * 0.52}, ${midX * 0.4} ${-b.h * 0.45}, ${midX * 0.35} ${-b.h * 0.42} Z`}
          fill={FILL[b.tone]}
          opacity={0.92}
        />
        <path
          d={`M${midX * 0.55} ${-b.h * 0.58}
             C ${midX * 0.55 + leaf} ${-b.h * 0.66}, ${midX * 0.55 + leaf * 1.15} ${-b.h * 0.78}, ${midX * 0.4} ${-b.h * 0.74}
             C ${midX * 0.55 + leaf * 0.25} ${-b.h * 0.68}, ${midX * 0.6} ${-b.h * 0.6}, ${midX * 0.55} ${-b.h * 0.58} Z`}
          fill={FILL[(b.tone + 1) % 3]}
          opacity={0.9}
        />
        <ellipse
          cx={tipX}
          cy={-b.h}
          rx={b.w * 0.9}
          ry={b.h * 0.06}
          fill={FILL[(b.tone + 2) % 3]}
          opacity={0.95}
        />
      </g>
    </g>
  );
}

function GrassTuft({ b, y }: { b: Blade; y: number }) {
  const amp = b.amp + 2;
  return (
    <g transform={`translate(${b.x} ${y})`}>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={`${-amp};${amp};${-amp}`}
          keyTimes="0;0.5;1"
          dur={`${b.dur * 0.85}s`}
          begin={`${b.delay}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
        />
        <path
          d={`M0 0
             C ${-b.w} ${-b.h * 0.45}, ${-b.w * 0.4} ${-b.h * 0.85}, ${b.lean * 0.2} ${-b.h}
             L ${b.lean * 0.2 + b.w * 0.35} ${-b.h * 0.92}
             C ${b.w * 0.2} ${-b.h * 0.55}, ${b.w * 0.8} ${-b.h * 0.25}, 0 0 Z`}
          fill={FILL[b.tone]}
        />
        <path
          d={`M${b.w * 0.3} 0
             C ${b.w} ${-b.h * 0.4}, ${b.w * 1.1} ${-b.h * 0.75}, ${b.lean * 0.4 + b.w} ${-b.h * 0.88}
             L ${b.lean * 0.4 + b.w * 1.25} ${-b.h * 0.8}
             C ${b.w * 1.4} ${-b.h * 0.45}, ${b.w * 0.9} ${-b.h * 0.2}, ${b.w * 0.3} 0 Z`}
          fill={FILL[(b.tone + 1) % 3]}
          opacity={0.88}
        />
      </g>
    </g>
  );
}

/**
 * Vector farm backdrop: static scenery + individually wind-swayed crops/grass.
 * Green palette only — no golden/yellow wheat look.
 */
export default function VectorFarmScene() {
  const farCrops = useMemo(() => makeBlades(42, 0, 1440, 11, 28, 52), []);
  const midCrops = useMemo(() => makeBlades(58, 0, 1440, 27, 48, 86), []);
  const nearGrass = useMemo(() => makeBlades(70, 0, 1440, 41, 70, 130), []);
  const frontGrass = useMemo(() => makeBlades(48, 0, 1440, 63, 90, 160), []);

  return (
    <div className="vf-scene" aria-hidden>
      <svg
        className="vf-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vfSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ec9b0" />
            <stop offset="42%" stopColor="#b7dfc6" />
            <stop offset="72%" stopColor="#d5eedd" />
            <stop offset="100%" stopColor="#e8f6ec" />
          </linearGradient>
          <linearGradient id="vfHillFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d6b4a" />
            <stop offset="100%" stopColor="#1e4f36" />
          </linearGradient>
          <linearGradient id="vfHillMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#357a4f" />
            <stop offset="100%" stopColor="#245c3a" />
          </linearGradient>
          <linearGradient id="vfField" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d8f55" />
            <stop offset="55%" stopColor="#2f7a45" />
            <stop offset="100%" stopColor="#226338" />
          </linearGradient>
          <linearGradient id="vfNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f9a58" />
            <stop offset="100%" stopColor="#1d5630" />
          </linearGradient>
          <radialGradient id="vfSun" cx="72%" cy="28%" r="18%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#cfe9d8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#cfe9d8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* —— static scenery —— */}
        <rect width="1440" height="900" fill="url(#vfSky)" />
        <circle cx="1040" cy="250" r="260" fill="url(#vfSun)" />

        {/* soft clouds — slow drift only */}
        <g className="vf-cloud vf-cloud-a" opacity="0.55">
          <ellipse cx="220" cy="140" rx="90" ry="28" fill="#eaf7ef" />
          <ellipse cx="270" cy="132" rx="55" ry="22" fill="#f3fbf6" />
          <ellipse cx="175" cy="148" rx="48" ry="18" fill="#dff0e6" />
        </g>
        <g className="vf-cloud vf-cloud-b" opacity="0.4">
          <ellipse cx="1180" cy="110" rx="110" ry="30" fill="#eaf7ef" />
          <ellipse cx="1240" cy="100" rx="60" ry="22" fill="#f3fbf6" />
        </g>

        {/* distant hills — static */}
        <path
          d="M0 430 C 160 390, 280 410, 420 395 C 560 380, 640 360, 780 375 C 940 392, 1080 350, 1240 370 C 1340 382, 1400 400, 1440 410 L 1440 520 L 0 520 Z"
          fill="url(#vfHillFar)"
          opacity="0.85"
        />
        <path
          d="M0 470 C 180 445, 320 485, 480 460 C 650 430, 760 450, 920 440 C 1080 428, 1220 455, 1440 445 L 1440 560 L 0 560 Z"
          fill="url(#vfHillMid)"
        />

        {/* tree silhouettes — static */}
        <g opacity="0.9">
          <rect x="180" y="400" width="10" height="48" rx="2" fill="#1a3f28" />
          <ellipse cx="185" cy="385" rx="28" ry="34" fill="#1f5a36" />
          <ellipse cx="168" cy="398" rx="18" ry="20" fill="#247044" />
          <ellipse cx="202" cy="396" rx="16" ry="18" fill="#1c643c" />
        </g>
        <g opacity="0.85">
          <rect x="1260" y="392" width="12" height="56" rx="2" fill="#1a3f28" />
          <ellipse cx="1266" cy="372" rx="34" ry="40" fill="#1f5a36" />
          <ellipse cx="1244" cy="388" rx="20" ry="22" fill="#247044" />
          <ellipse cx="1288" cy="386" rx="18" ry="20" fill="#1c643c" />
        </g>
        <g opacity="0.75">
          <rect x="980" y="410" width="8" height="36" rx="2" fill="#1a3f28" />
          <ellipse cx="984" cy="398" rx="22" ry="26" fill="#226840" />
        </g>

        {/* mid field plane — static */}
        <path
          d="M0 520 C 200 505, 400 530, 640 515 C 880 500, 1100 525, 1440 510 L 1440 680 L 0 680 Z"
          fill="url(#vfField)"
        />
        {/* subtle crop rows (static texture) */}
        <g opacity="0.18" stroke="#143f26" strokeWidth="1.2" fill="none">
          {Array.from({ length: 14 }).map((_, i) => {
            const y = 540 + i * 10;
            return (
              <path
                key={i}
                d={`M0 ${y} Q 360 ${y - 6}, 720 ${y + 2} T 1440 ${y - 3}`}
              />
            );
          })}
        </g>

        {/* near ground — static */}
        <path
          d="M0 640 C 240 620, 480 655, 760 635 C 1040 615, 1240 650, 1440 640 L 1440 900 L 0 900 Z"
          fill="url(#vfNear)"
        />

        {/* —— animated crop / grass only —— */}
        <g className="vf-layer vf-layer-far">
          {farCrops.map((b) => (
            <CropBlade key={b.id} b={b} y={545} />
          ))}
        </g>
        <g className="vf-layer vf-layer-mid">
          {midCrops.map((b) => (
            <CropBlade key={b.id} b={b} y={620} />
          ))}
        </g>
        <g className="vf-layer vf-layer-near">
          {nearGrass.map((b) => (
            <GrassTuft key={b.id} b={b} y={760} />
          ))}
        </g>
        <g className="vf-layer vf-layer-front">
          {frontGrass.map((b) => (
            <GrassTuft key={b.id} b={b} y={880} />
          ))}
        </g>
      </svg>
    </div>
  );
}
