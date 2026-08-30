"use client";

import clsx from "clsx";

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-full border border-white/8 bg-white/[0.05] p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={clsx(
            "flex-1 rounded-full py-2 text-[13.5px] font-semibold transition",
            value === opt
              ? "bg-white/[0.14] text-white"
              : "text-text-secondary hover:text-white"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
