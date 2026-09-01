"use client";

import Image from "next/image";
import { useMemo } from "react";

type Leaf = {
  id: string;
  x: number;
  y: number;
  scale: number;
  rot: number;
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

const LEAF_FILL = ["#1f9a45", "#2eb854", "#3dcf63", "#168a3a"] as const;
const LEAF_SHADOW = ["#0f6b2e", "#1a7f38", "#249644", "#0c5c26"] as const;
const LEAF_LITE = ["#6fe08a", "#7eeba0", "#95f5b2", "#58d67a"] as const;

/** Broad leafy crop plant — matches vibrant agri illustration style */
function LeafPlant({ leaf }: { leaf: Leaf }) {
  const s = leaf.scale;
  return (
    <g
      transform={`translate(${leaf.x} ${leaf.y}) scale(${leaf.flip ? -s : s} ${s})`}
    >
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
        {/* stem */}
        <path
          d="M0 0 C 2 -28, -2 -55, 1 -78"
          fill="none"
          stroke={LEAF_SHADOW[leaf.tone]}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* lower left leaf */}
        <path
          d="M2 -22
             C -18 -30, -42 -28, -52 -18
             C -38 -12, -18 -8, 2 -18 Z"
          fill={LEAF_FILL[leaf.tone]}
        />
        <path
          d="M0 -20 C -16 -26, -34 -24, -44 -18"
          fill="none"
          stroke={LEAF_LITE[leaf.tone]}
          strokeWidth="1.4"
          opacity="0.55"
        />
        {/* lower right leaf */}
        <path
          d="M2 -28
             C 22 -38, 48 -36, 58 -24
             C 42 -18, 20 -14, 2 -24 Z"
          fill={LEAF_SHADOW[(leaf.tone + 1) % 4]}
        />
        {/* mid left */}
        <path
          d="M0 -48
             C -22 -62, -50 -58, -62 -42
             C -44 -38, -20 -36, 0 -44 Z"
          fill={LEAF_FILL[(leaf.tone + 2) % 4]}
        />
        <path
          d="M-2 -46 C -20 -56, -40 -54, -52 -44"
          fill="none"
          stroke={LEAF_LITE[(leaf.tone + 1) % 4]}
          strokeWidth="1.5"
          opacity="0.5"
        />
        {/* mid right */}
        <path
          d="M2 -52
             C 26 -68, 56 -64, 68 -46
             C 48 -42, 22 -40, 2 -48 Z"
          fill={LEAF_FILL[(leaf.tone + 3) % 4]}
        />
        {/* top leaf cluster */}
        <path
          d="M0 -72
             C -16 -92, -8 -108, 2 -118
             C 12 -108, 18 -92, 2 -72 Z"
          fill={LEAF_LITE[leaf.tone]}
        />
        <path
          d="M0 -70
             C -28 -88, -36 -78, -28 -62
             C -16 -66, -6 -68, 0 -70 Z"
          fill={LEAF_FILL[leaf.tone]}
        />
        <path
          d="M2 -70
             C 30 -90, 40 -78, 32 -60
             C 18 -64, 8 -68, 2 -70 Z"
          fill={LEAF_SHADOW[leaf.tone]}
        />
      </g>
    </g>
  );
}

function GrassTuft({
  x,
  y,
  scale,
  dur,
  delay,
  amp,
  tone,
}: {
  x: number;
  y: number;
  scale: number;
  dur: number;
  delay: number;
  amp: number;
  tone: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
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
          d="M0 0 C -6 -22, -2 -40, -4 -58 L 2 -56 C 4 -38, 2 -20, 0 0 Z"
          fill={LEAF_FILL[tone % 4]}
        />
        <path
          d="M4 0 C 10 -24, 14 -42, 18 -60 L 24 -56 C 16 -40, 10 -22, 4 0 Z"
          fill={LEAF_SHADOW[tone % 4]}
        />
        <path
          d="M-3 0 C -14 -20, -18 -36, -22 -52 L -16 -54 C -10 -36, -6 -18, -3 0 Z"
          fill={LEAF_LITE[tone % 4]}
        />
      </g>
    </g>
  );
}

/**
 * Vibrant farm hero: illustration backdrop + animated leafy crops (wind only on plants).
 * Style matched to the agri marketing reference — bright greens, not dull/yellow.
 */
export default function VectorFarmScene() {
  const leftPlants = useMemo<Leaf[]>(() => {
    const out: Leaf[] = [];
    for (let i = 0; i < 14; i++) {
      const r1 = seeded(10 + i * 2.3);
      const r2 = seeded(40 + i * 4.1);
      out.push({
        id: `L${i}`,
        x: 40 + (i % 7) * 55 + r1 * 20,
        y: 720 + Math.floor(i / 7) * 70 + r2 * 25,
        scale: 1.05 + r1 * 0.55,
        rot: 0,
        tone: (i % 4) as 0 | 1 | 2 | 3,
        dur: 2.8 + r2 * 2.2,
        delay: -r1 * 3.5,
        amp: 4 + r2 * 5,
        flip: i % 3 === 0,
      });
    }
    return out;
  }, []);

  const rightPlants = useMemo<Leaf[]>(() => {
    const out: Leaf[] = [];
    for (let i = 0; i < 14; i++) {
      const r1 = seeded(70 + i * 2.7);
      const r2 = seeded(90 + i * 3.9);
      out.push({
        id: `R${i}`,
        x: 980 + (i % 7) * 58 + r1 * 22,
        y: 710 + Math.floor(i / 7) * 75 + r2 * 28,
        scale: 1.1 + r1 * 0.6,
        rot: 0,
        tone: ((i + 1) % 4) as 0 | 1 | 2 | 3,
        dur: 2.6 + r2 * 2.4,
        delay: -r1 * 4,
        amp: 4.5 + r2 * 5.5,
        flip: i % 2 === 0,
      });
    }
    return out;
  }, []);

  const midPlants = useMemo<Leaf[]>(() => {
    const out: Leaf[] = [];
    for (let i = 0; i < 10; i++) {
      const r1 = seeded(120 + i * 5.1);
      const r2 = seeded(150 + i * 2.2);
      out.push({
        id: `M${i}`,
        x: 320 + i * 85 + r1 * 30,
        y: 640 + r2 * 40,
        scale: 0.55 + r1 * 0.35,
        rot: 0,
        tone: ((i + 2) % 4) as 0 | 1 | 2 | 3,
        dur: 3.2 + r2 * 2,
        delay: -r1 * 3,
        amp: 3 + r2 * 4,
        flip: i % 2 === 1,
      });
    }
    return out;
  }, []);

  const grasses = useMemo(() => {
    const out = [];
    for (let i = 0; i < 28; i++) {
      const r1 = seeded(200 + i);
      const r2 = seeded(300 + i * 1.7);
      out.push({
        id: `G${i}`,
        x: 80 + i * 48 + r1 * 20,
        y: 820 + r2 * 50,
        scale: 0.7 + r1 * 0.5,
        dur: 2.2 + r2 * 1.8,
        delay: -r1 * 2.5,
        amp: 6 + r2 * 6,
        tone: i % 4,
      });
    }
    return out;
  }, []);

  return (
    <div className="vf-scene" aria-hidden>
      <Image
        src="/farm-vibrant.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="vf-backdrop object-cover object-[center_42%]"
      />
      {/* Cool green wash — keep scene verdant, not yellow */}
      <div className="vf-tint" />

      <svg
        className="vf-svg vf-svg-overlay"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vfFadeBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#145a32" stopOpacity="0" />
            <stop offset="55%" stopColor="#145a32" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0f4a28" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        {/* soft depth veil so leaves sit in scene */}
        <rect width="1440" height="900" fill="url(#vfFadeBottom)" />

        <g className="vf-layer vf-layer-mid">
          {midPlants.map((leaf) => (
            <LeafPlant key={leaf.id} leaf={leaf} />
          ))}
        </g>
        <g className="vf-layer vf-layer-near">
          {leftPlants.map((leaf) => (
            <LeafPlant key={leaf.id} leaf={leaf} />
          ))}
          {rightPlants.map((leaf) => (
            <LeafPlant key={leaf.id} leaf={leaf} />
          ))}
        </g>
        <g className="vf-layer vf-layer-front">
          {grasses.map((g) => (
            <GrassTuft key={g.id} {...g} />
          ))}
        </g>
      </svg>
    </div>
  );
}
