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

/** Detailed utility tractor — real proportions, blue body */
function Tractor({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="vf-tractor">
      <ellipse cx="78" cy="132" rx="92" ry="11" fill="#063018" opacity="0.3" />

      {/* rear tire */}
      <g transform="translate(32 88)">
        <circle r="44" fill="#111" />
        <circle r="38" fill="#222" />
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={Math.cos(a) * 34}
              y1={Math.sin(a) * 34}
              x2={Math.cos(a) * 44}
              y2={Math.sin(a) * 44}
              stroke="#0a0a0a"
              strokeWidth="6"
              strokeLinecap="round"
            />
          );
        })}
        <circle r="20" fill="#d4b06a" />
        <circle r="14" fill="#b89248" />
        <circle r="11" fill="#8a6a30" />
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return <circle key={deg} cx={Math.cos(a) * 7.5} cy={Math.sin(a) * 7.5} r="1.8" fill="#5c4820" />;
        })}
        <circle r="4" fill="#3a3018" />
      </g>

      {/* front tire */}
      <g transform="translate(138 104)">
        <circle r="26" fill="#111" />
        <circle r="21" fill="#222" />
        {Array.from({ length: 11 }).map((_, i) => {
          const a = (i / 11) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={Math.cos(a) * 18}
              y1={Math.sin(a) * 18}
              x2={Math.cos(a) * 26}
              y2={Math.sin(a) * 26}
              stroke="#0a0a0a"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        })}
        <circle r="11" fill="#d4b06a" />
        <circle r="7" fill="#b89248" />
        <circle r="3" fill="#3a3018" />
      </g>

      {/* axle / frame */}
      <path d="M48 98 H 130 V 108 H 48 Z" fill="#1a3324" />
      <path d="M55 94 H 118 V 100 H 55 Z" fill="#2a4a36" />

      {/* rear fender */}
      <path
        d="M6 78 C 4 48, 52 40, 64 58 L 66 90 C 44 102, 10 100, 6 78 Z"
        fill="#1a6fd4"
      />
      <path
        d="M14 74 C 16 54, 48 50, 56 64"
        fill="none"
        stroke="#6aaff5"
        strokeWidth="2.5"
        opacity="0.6"
      />

      {/* engine hood */}
      <path
        d="M58 90 L 58 52 C 58 44, 66 38, 78 38 L 138 44 C 150 46, 156 54, 156 62
           L 156 90 L 140 96 L 66 96 Z"
        fill="#1f7ae8"
      />
      <path
        d="M78 40 L 136 46 C 146 48, 150 52, 150 58 L 78 52 Z"
        fill="#4ea0f5"
      />
      <path d="M58 90 L 58 58 L 78 50 L 78 90 Z" fill="#155fbf" opacity="0.65" />
      {/* hood vents */}
      {[56, 62, 68, 74].map((vy) => (
        <rect key={vy} x="88" y={vy} width="28" height="2.2" rx="1" fill="#0f4a9a" opacity="0.55" />
      ))}
      {/* grille */}
      <rect x="140" y="56" width="14" height="28" rx="2.5" fill="#121820" />
      {[60, 65, 70, 75, 80].map((gy) => (
        <line key={gy} x1="142" y1={gy} x2="152" y2={gy} stroke="#7a8898" strokeWidth="1.4" />
      ))}
      <circle cx="154" cy="62" r="5" fill="#ffe6a0" />
      <circle cx="154" cy="62" r="2.8" fill="#fff8d8" />

      {/* cabin */}
      <path
        d="M66 52 L 66 18 C 66 10, 74 4, 84 4 L 116 4 C 126 4, 132 12, 132 20
           L 132 52 Z"
        fill="#1a6fd4"
      />
      {/* roof */}
      <path
        d="M62 20 L 62 12 C 62 6, 72 0, 84 0 L 120 0 C 130 0, 138 6, 138 14 L 134 22 Z"
        fill="#124e9e"
      />
      <path d="M70 4 H 122 V 12 H 74 Z" fill="#3d8ee8" opacity="0.75" />
      {/* windshield */}
      <path d="M88 12 H 124 V 48 H 88 Z" fill="#c5ecff" />
      <path d="M88 12 H 124 V 26 H 88 Z" fill="#ffffff" opacity="0.4" />
      {/* side window */}
      <path d="M70 16 H 86 V 48 H 70 Z" fill="#9ad8f8" />
      <line x1="86" y1="12" x2="86" y2="52" stroke="#0d3f88" strokeWidth="2" />
      {/* mirror */}
      <rect x="128" y="22" width="8" height="5" rx="1" fill="#2a2a2a" />
      <line x1="128" y1="24" x2="122" y2="28" stroke="#2a2a2a" strokeWidth="1.5" />

      {/* seat hint */}
      <rect x="92" y="40" width="14" height="10" rx="2" fill="#1a3a28" opacity="0.5" />

      {/* exhaust */}
      <rect x="118" y="-8" width="7" height="36" rx="2" fill="#333" />
      <rect x="115" y="-14" width="13" height="10" rx="2.5" fill="#222" />
      <rect x="117" y="-12" width="9" height="4" rx="1" fill="#555" />

      {/* front ballast */}
      <rect x="152" y="82" width="12" height="16" rx="2" fill="#1558b0" />
      <circle cx="158" cy="90" r="2.5" fill="#d4b06a" />

      {/* step + handrail */}
      <rect x="62" y="88" width="16" height="5" rx="1" fill="#1558b0" />
      <path d="M78 52 V 88" stroke="#0d3f88" strokeWidth="2" />
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
        <Tractor x={610} y={520} scale={1.45} />

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
