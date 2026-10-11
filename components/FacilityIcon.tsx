"use client";

import {
  Couch,
  ForkKnife,
  Sun,
  Armchair,
  Television,
  Snowflake,
  Flame,
  CookingPot,
  Knife,
  Bed,
  Package,
  Desk,
  WashingMachine,
  Wind,
  TShirt,
  Thermometer,
  Bathtub,
  WifiHigh,
  Drop,
  Lightning,
  type IconProps,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType<IconProps>> = {
  Couch,
  ForkKnife,
  Sun,
  Armchair,
  Television,
  Snowflake,
  Flame,
  CookingPot,
  Knife,
  Bed,
  Package,
  Desk,
  WashingMachine,
  Wind,
  TShirt,
  Thermometer,
  Bathtub,
  WifiHigh,
  Drop,
  Lightning,
};

interface FacilityIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function FacilityIcon({
  name,
  size = 18,
  className = "text-opala-charcoal",
}: FacilityIconProps) {
  const IconComponent = iconMap[name] || Sun;
  return <IconComponent size={size} weight="light" className={className} />;
}
