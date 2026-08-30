"use client";

import clsx from "clsx";

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <div className="flex rounded-full hairline surface p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={clsx(
            "flex-1 rounded-full py-2 text-[13.5px] font-semibold transition",
            value === opt
              ? "surface-2 text-text-primary"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          {labels?.[opt] ?? opt}
        </button>
      ))}
    </div>
  );
}
