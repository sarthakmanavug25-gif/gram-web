"use client";

import {
  Droplets,
  Fuel,
  Leaf,
  Package,
  SprayCan,
  Tractor,
  TriangleAlert,
  Truck,
  Users,
} from "lucide-react";
import type { CategoryMeta } from "@/lib/seed/categories";

const MAP = {
  "triangle-alert": TriangleAlert,
  leaf: Leaf,
  users: Users,
  spray: SprayCan,
  fuel: Fuel,
  droplets: Droplets,
  truck: Truck,
  tractor: Tractor,
  package: Package,
} satisfies Record<CategoryMeta["icon"], unknown>;

export default function CategoryIcon({
  name,
  size = 18,
}: {
  name: CategoryMeta["icon"];
  size?: number;
}) {
  const Icon = MAP[name] as React.ComponentType<{ size?: number }>;
  return <Icon size={size} />;
}
