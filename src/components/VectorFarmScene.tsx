"use client";

import { useMemo } from "react";

type Leaf = {
  id: string;
  x: number;
  y: number;
  scale: number;
  tone: 0 | 1 | 2 | 3;
  dur: number;
  delay: number;
  amp: number;
  flip?: boolean;
};

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const LEAF = ["#12a344", "#1db954", "#2ad468", "#0d8f38"] as const;
const LEAF_DK = ["#0a7a30", "#128a3a", "#1aa048", "#086828"] as const;
const LEAF_LT = ["#5ce87e", "#6ef290", "#84ff9f", "#48dc6c"] as const;

/** Detailed utility tractor — blue body, real proportions */
function Tractor({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="vf-tractor">
      {/* ground shadow */}
      <ellipse cx="70" cy="118" rx="78" ry="10" fill="#0a3d1c" opacity="0.28" />

      {/* —— rear wheel (large) —— */}
      <g transform="translate(28 78)">
        <circle cx="0" cy="0" r="38" fill="#1a1a1a" />
        <circle cx="0" cy="0" r="33" fill="#2a2a2a" />
        {/* tire tread notches */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = Math.cos(a) * 30;
          const y1 = Math.sin(a) * 30;
          const x2 = Math.cos(a) * 38;
          const y2 = Math.sin(a) * 38;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#0d0d0d"
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="0" cy="0" r="18" fill="#c4a35a" />
        <circle cx="0" cy="0" r="12" fill="#a8863f" />
        <circle cx="0" cy="0" r="5" fill="#5c4a22" />
        {/* hub bolts */}
        {[0, 72, 144, 216, 288].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return (
            <circle
              key={deg}
              cx={Math.cos(a) * 8}
              cy={Math.sin(a) * 8}
              r="1.6"
              fill="#6b5828"
            />
          );
        })}
      </g>

      {/* —— front wheel (smaller) —— */}
      <g transform="translate(118 92)">
        <circle cx="0" cy="0" r="22" fill="#1a1a1a" />
        <circle cx="0" cy="0" r="18" fill="#2a2a2a" />
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={Math.cos(a) * 15}
              y1={Math.sin(a) * 15}
              x2={Math.cos(a) * 22}
              y2={Math.sin(a) * 22}
              stroke="#0d0d0d"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="0" cy="0" r="10" fill="#c4a35a" />
        <circle cx="0" cy="0" r="6" fill="#a8863f" />
        <circle cx="0" cy="0" r="2.5" fill="#5c4a22" />
      </g>

      {/* chassis / axle bar */}
      <rect x="40" y="88" width="78" height="8" rx="2" fill="#1e3a28" />
      <rect x="48" y="84" width="55" height="6" rx="1.5" fill="#2d5a40" />

      {/* rear fender */}
      <path
        d="M8 70 C 8 48, 48 42, 58 58 L 58 78 C 40 86, 12 86, 8 70 Z"
        fill="#1e6fd0"
      />
      <path
        d="M12 68 C 14 52, 44 48, 52 60"
        fill="none"
        stroke="#5a9eef"
        strokeWidth="2"
        opacity="0.55"
      />

      {/* main body / hood */}
      <path
        d="M52 78 L 52 48 C 52 42, 58 38, 68 38 L 118 42 C 128 44, 132 50, 132 56
           L 132 78 L 120 82 L 58 82 Z"
        fill="#2178e0"
      />
      {/* hood top highlight */}
      <path
        d="M68 40 L 116 44 C 122 45, 126 48, 126 52 L 68 48 Z"
        fill="#4a9af0"
        opacity="0.85"
      />
      {/* side panel shade */}
      <path
        d="M52 78 L 52 55 L 68 48 L 68 78 Z"
        fill="#1a5fbc"
        opacity="0.55"
      />
      {/* grille */}
      <rect x="118" y="52" width="12" height="22" rx="2" fill="#152030" />
      {[56, 60, 64, 68].map((gy) => (
        <line key={gy} x1="120" y1={gy} x2="128" y2={gy} stroke="#6a7a8a" strokeWidth="1.2" />
      ))}
      {/* headlight */}
      <circle cx="130" cy="58" r="4.5" fill="#ffe9a8" />
      <circle cx="130" cy="58" r="2.5" fill="#fff6d0" />

      {/* cabin */}
      <path
        d="M58 48 L 58 22 C 58 16, 64 12, 72 12 L 98 12 C 106 12, 110 18, 110 24
           L 110 48 Z"
        fill="#1c6fd4"
      />
      {/* cabin roof */}
      <path
        d="M56 22 L 56 16 C 56 12, 62 8, 72 8 L 100 8 C 108 8, 114 12, 114 18 L 112 24 Z"
        fill="#1558b0"
      />
      <path
        d="M62 10 L 98 10 C 104 10, 108 13, 108 16 L 64 16 C 62 16, 60 14, 60 12 Z"
        fill="#3d8ae8"
        opacity="0.7"
      />
      {/* windshield */}
      <path
        d="M74 18 L 104 18 L 104 44 L 74 44 Z"
        fill="#b8e4ff"
        opacity="0.92"
      />
      <path
        d="M74 18 L 104 18 L 104 28 L 74 36 Z"
        fill="#ffffff"
        opacity="0.35"
      />
      {/* side window */}
      <path
        d="M62 20 L 72 20 L 72 44 L 62 44 Z"
        fill="#9ad4f5"
        opacity="0.85"
      />
      {/* door line */}
      <line x1="72" y1="18" x2="72" y2="48" stroke="#0f4a9a" strokeWidth="1.5" />

      {/* exhaust stack */}
      <rect x="100" y="0" width="6" height="28" rx="1.5" fill="#3a3a3a" />
      <rect x="98" y="-4" width="10" height="8" rx="2" fill="#2a2a2a" />
      <rect x="100" y="-2" width="6" height="3" rx="1" fill="#555" />

      {/* front weight / bumper */}
      <rect x="128" y="72" width="10" height="12" rx="2" fill="#1a4a8a" />
      <circle cx="133" cy="78" r="2" fill="#c4a35a" />

      {/* step */}
      <rect x="54" y="78" width="14" height="4" rx="1" fill="#1a4a8a" />
    </g>
  );
}

function LeafPlant({ leaf }: { leaf: Leaf }) {
  const s = leaf.scale;
  return (
    <g transform={`translate(${leaf.x} ${leaf.y}) scale(${leaf.flip ? -s : s} ${s})`}>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={`${-leaf.amp};${leaf.amp};${-leaf.amp}`}
          keyTimes="0;0.5;1"
          dur={`${leaf.dur}s`}
          begin={`${leaf.delay}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
        />
        <path
          d="M0 0 C 2 -30, -2 -58, 1 -82"
          fill="none"
          stroke={LEAF_DK[leaf.tone]}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d="M2 -24 C -20 -34, -48 -30, -58 -16 C -42 -10, -18 -6, 2 -18 Z"
          fill={LEAF[leaf.tone]}
        />
        <path
          d="M0 -22 C -18 -30, -38 -26, -48 -16"
          fill="none"
          stroke={LEAF_LT[leaf.tone]}
          strokeWidth="1.6"
          opacity="0.65"
        />
        <path
          d="M2 -32 C 24 -44, 52 -40, 64 -24 C 46 -18, 22 -14, 2 -26 Z"
          fill={LEAF_DK[(leaf.tone + 1) % 4]}
        />
        <path
          d="M0 -52 C -24 -68, -54 -62, -66 -42 C -46 -38, -20 -36, 0 -48 Z"
          fill={LEAF[(leaf.tone + 2) % 4]}
        />
        <path
          d="M-2 -50 C -22 -62, -44 -58, -56 -44"
          fill="none"
          stroke={LEAF_LT[(leaf.tone + 1) % 4]}
          strokeWidth="1.6"
          opacity="0.55"
        />
        <path
          d="M2 -56 C 28 -74, 58 -68, 72 -46 C 50 -42, 22 -40, 2 -52 Z"
          fill={LEAF[(leaf.tone + 3) % 4]}
        />
        <path
          d="M0 -76 C -18 -98, -8 -116, 2 -126 C 14 -116, 20 -98, 2 -76 Z"
          fill={LEAF_LT[leaf.tone]}
        />
        <path
          d="M0 -74 C -30 -94, -40 -82, -30 -64 C -16 -68, -4 -72, 0 -74 Z"
          fill={LEAF[leaf.tone]}
        />
        <path
          d="M2 -74 C 32 -96, 44 -82, 34 -62 C 18 -66, 8 -72, 2 -74 Z"
          fill={LEAF_DK[leaf.tone]}
        />
      </g>
    </g>
  );
}

function GrassBlade({
  x,
  y,
  h,
  lean,
  tone,
  dur,
  delay,
  amp,
}: {
  x: number;
  y: number;
  h: number;
  lean: number;
  tone: number;
  dur: number;
  delay: number;
  amp: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={`${-amp};${amp};${-amp}`}
          keyTimes="0;0.5;1"
          dur={`${dur}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
        />
        <path
          d={`M0 0
             C ${-4 + lean * 0.2} ${-h * 0.4}, ${lean * 0.5} ${-h * 0.75}, ${lean} ${-h}
             L ${lean + 3.5} ${-h + 4}
             C ${lean * 0.4 + 2} ${-h * 0.55}, ${2} ${-h * 0.25}, 0 0 Z`}
          fill={LEAF[tone % 4]}
        />
        <path
          d={`M3 0
             C ${8 + lean * 0.1} ${-h * 0.35}, ${12 + lean} ${-h * 0.7}, ${10 + lean} ${-h * 0.92}
             L ${14 + lean} ${-h * 0.85}
             C ${12} ${-h * 0.5}, ${8} ${-h * 0.2}, 3 0 Z`}
          fill={LEAF_DK[tone % 4]}
        />
      </g>
    </g>
  );
}

function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-4" y="20" width="8" height="36" rx="2" fill="#5a3a1a" />
      <ellipse cx="0" cy="8" rx="22" ry="26" fill="#149644" />
      <ellipse cx="-12" cy="18" rx="14" ry="16" fill="#0f7a36" />
      <ellipse cx="12" cy="16" rx="13" ry="15" fill="#1db954" />
      <ellipse cx="0" cy="-4" rx="12" ry="14" fill="#3dcf63" />
    </g>
  );
}

/**
 * Crisp vector farm scene — no raster backdrop.
 * Bright greens, detailed tractor, wind only on crops/grass.
 */
export default function VectorFarmScene() {
  const cropRows = useMemo(() => {
    const rows: { y: number; shade: string }[] = [];
    for (let i = 0; i < 18; i++) {
      rows.push({
        y: 430 + i * 12,
        shade: i % 2 === 0 ? "#1db954" : "#149644",
      });
    }
    return rows;
  }, []);

  const leftPlants = useMemo<Leaf[]>(() => {
    const out: Leaf[] = [];
    for (let i = 0; i < 12; i++) {
      const r1 = seeded(10 + i * 2.3);
      const r2 = seeded(40 + i * 4.1);
      out.push({
        id: `L${i}`,
        x: 30 + (i % 6) * 58 + r1 * 18,
        y: 700 + Math.floor(i / 6) * 75 + r2 * 22,
        scale: 1.15 + r1 * 0.55,
        tone: (i % 4) as 0 | 1 | 2 | 3,
        dur: 2.7 + r2 * 2.1,
        delay: -r1 * 3.5,
        amp: 4.5 + r2 * 5,
        flip: i % 3 === 0,
      });
    }
    return out;
  }, []);

  const rightPlants = useMemo<Leaf[]>(() => {
    const out: Leaf[] = [];
    for (let i = 0; i < 9; i++) {
      const r1 = seeded(70 + i * 2.7);
      const r2 = seeded(90 + i * 3.9);
      out.push({
        id: `R${i}`,
        x: 1220 + (i % 5) * 42 + r1 * 14,
        y: 760 + Math.floor(i / 5) * 55 + r2 * 18,
        scale: 1 + r1 * 0.4,
        tone: ((i + 1) % 4) as 0 | 1 | 2 | 3,
        dur: 2.5 + r2 * 2.3,
        delay: -r1 * 4,
        amp: 4 + r2 * 5,
        flip: i % 2 === 0,
      });
    }
    return out;
  }, []);

  const midBlades = useMemo(() => {
    const out = [];
    for (let i = 0; i < 90; i++) {
      const r1 = seeded(200 + i * 1.3);
      const r2 = seeded(400 + i * 2.1);
      const x = 40 + (i % 30) * 46 + r1 * 20;
      const row = Math.floor(i / 30);
      // keep clear of phone column
      if (x > 880 && x < 1160) continue;
      out.push({
        id: `B${i}`,
        x,
        y: 560 + row * 55 + r2 * 18,
        h: 36 + r1 * 42,
        lean: (r2 - 0.5) * 8,
        tone: i % 4,
        dur: 2.4 + r2 * 2.2,
        delay: -r1 * 3.2,
        amp: 5 + r2 * 6,
      });
    }
    return out;
  }, []);

  const frontGrass = useMemo(() => {
    const out = [];
    for (let i = 0; i < 40; i++) {
      const r1 = seeded(500 + i);
      const r2 = seeded(600 + i * 1.4);
      const x = 20 + i * 36 + r1 * 16;
      if (x > 860 && x < 1180) continue;
      out.push({
        id: `F${i}`,
        x,
        y: 860 + r2 * 30,
        h: 55 + r1 * 50,
        lean: (r2 - 0.5) * 10,
        tone: i % 4,
        dur: 2.1 + r2 * 1.8,
        delay: -r1 * 2.8,
        amp: 7 + r2 * 6,
      });
    }
    return out;
  }, []);

  return (
    <div className="vf-scene" aria-hidden>
      <svg
        className="vf-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
      >
        <defs>
          <linearGradient id="vfSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ec8ef" />
            <stop offset="38%" stopColor="#b6e4f5" />
            <stop offset="70%" stopColor="#d4f2e4" />
            <stop offset="100%" stopColor="#c8efd4" />
          </linearGradient>
          <linearGradient id="vfMount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7eb8d8" />
            <stop offset="100%" stopColor="#5a9aba" />
          </linearGradient>
          <linearGradient id="vfMountFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8d0e8" />
            <stop offset="100%" stopColor="#7eb0cc" />
          </linearGradient>
          <linearGradient id="vfHill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2ad468" />
            <stop offset="100%" stopColor="#149644" />
          </linearGradient>
          <linearGradient id="vfField" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#28c85c" />
            <stop offset="55%" stopColor="#1aad48" />
            <stop offset="100%" stopColor="#128a38" />
          </linearGradient>
          <linearGradient id="vfPath" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b4424" />
            <stop offset="50%" stopColor="#8a5a32" />
            <stop offset="100%" stopColor="#6b4424" />
          </linearGradient>
          <radialGradient id="vfSunGlowR" cx="72%" cy="22%" r="20%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#b8e8f8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#b8e8f8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* sky — crisp, cool, not dull yellow */}
        <rect width="1440" height="900" fill="url(#vfSky)" />
        <circle cx="1040" cy="200" r="240" fill="url(#vfSunGlowR)" />

        {/* clouds */}
        <g className="vf-cloud vf-cloud-a" opacity="0.85">
          <ellipse cx="260" cy="120" rx="100" ry="26" fill="#ffffff" />
          <ellipse cx="320" cy="112" rx="60" ry="22" fill="#f4fcff" />
          <ellipse cx="210" cy="128" rx="50" ry="18" fill="#e8f6fc" />
        </g>
        <g className="vf-cloud vf-cloud-b" opacity="0.7">
          <ellipse cx="1180" cy="95" rx="120" ry="28" fill="#ffffff" />
          <ellipse cx="1250" cy="88" rx="55" ry="20" fill="#f4fcff" />
        </g>

        {/* far mountains */}
        <path
          d="M0 340 L 120 260 L 220 310 L 340 230 L 480 300 L 620 210 L 760 290
             L 900 200 L 1040 280 L 1180 220 L 1320 270 L 1440 240 L 1440 380 L 0 380 Z"
          fill="url(#vfMountFar)"
        />
        <path
          d="M0 360 L 160 290 L 280 340 L 420 270 L 560 330 L 720 250 L 880 320
             L 1040 260 L 1200 310 L 1360 270 L 1440 300 L 1440 400 L 0 400 Z"
          fill="url(#vfMount)"
        />

        {/* rolling hills */}
        <path
          d="M0 390 C 200 360, 380 410, 560 375 C 760 335, 960 400, 1180 360
             C 1300 340, 1380 355, 1440 350 L 1440 480 L 0 480 Z"
          fill="url(#vfHill)"
        />
        <path
          d="M0 440 C 180 415, 360 460, 540 430 C 740 395, 940 455, 1160 420
             C 1300 400, 1400 415, 1440 410 L 1440 520 L 0 520 Z"
          fill="#1db954"
        />

        {/* trees on right ridge */}
        <Tree x={1120} y={355} scale={0.85} />
        <Tree x={1165} y={348} scale={1.05} />
        <Tree x={1215} y={352} scale={0.75} />
        <Tree x={1260} y={345} scale={0.95} />
        <Tree x={980} y={370} scale={0.55} />

        {/* main field */}
        <path
          d="M0 480 C 240 460, 480 500, 760 470 C 1040 440, 1240 490, 1440 470
             L 1440 900 L 0 900 Z"
          fill="url(#vfField)"
        />

        {/* crop row texture (static — crisp stripes) */}
        <g opacity="0.35">
          {cropRows.map((row, i) => (
            <path
              key={i}
              d={`M0 ${row.y} Q 360 ${row.y - 8}, 720 ${row.y + 3} T 1440 ${row.y - 4}`}
              fill="none"
              stroke={row.shade}
              strokeWidth="5"
            />
          ))}
        </g>

        {/* dirt path — perspective toward horizon */}
        <path
          d="M620 500
             C 640 560, 600 640, 560 720
             C 520 800, 480 860, 450 900
             L 720 900
             C 780 840, 820 760, 840 680
             C 860 600, 850 540, 830 500
             Z"
          fill="url(#vfPath)"
        />
        {/* path center tracks */}
        <path
          d="M700 505 C 690 600, 660 720, 620 900"
          fill="none"
          stroke="#5a381c"
          strokeWidth="3"
          opacity="0.45"
        />
        <path
          d="M760 505 C 770 600, 780 720, 800 900"
          fill="none"
          stroke="#5a381c"
          strokeWidth="3"
          opacity="0.45"
        />
        {/* path edge grass lips */}
        <path
          d="M620 500 C 640 560, 600 640, 560 720"
          fill="none"
          stroke="#0f8f38"
          strokeWidth="6"
          opacity="0.4"
        />
        <path
          d="M830 500 C 850 540, 860 600, 840 680"
          fill="none"
          stroke="#0f8f38"
          strokeWidth="6"
          opacity="0.4"
        />

        {/* mid-field crop blades — wind */}
        <g className="vf-layer">
          {midBlades.map((b) => (
            <GrassBlade key={b.id} {...b} />
          ))}
        </g>

        {/* tractor on path */}
        <Tractor x={640} y={545} scale={1.15} />

        {/* near leafy plants — wind */}
        <g className="vf-layer">
          {leftPlants.map((leaf) => (
            <LeafPlant key={leaf.id} leaf={leaf} />
          ))}
          {rightPlants.map((leaf) => (
            <LeafPlant key={leaf.id} leaf={leaf} />
          ))}
        </g>

        {/* front grass — wind */}
        <g className="vf-layer">
          {frontGrass.map((b) => (
            <GrassBlade key={b.id} {...b} />
          ))}
        </g>
      </svg>
    </div>
  );
}
