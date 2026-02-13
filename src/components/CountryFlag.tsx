"use client";

import * as Flags from "country-flag-icons/react/3x2";
import { hasFlag } from "country-flag-icons";

interface CountryFlagProps {
  code: string;
  className?: string;
  title?: string;
}

type FlagKey = keyof typeof Flags;

/**
 * Renders a rectangular (3:2) SVG flag for the given ISO 3166-1 alpha-2 country code.
 * Returns null if the code is invalid or unsupported.
 */
export function CountryFlag({ code, className, title }: CountryFlagProps) {
  const upper = code?.toUpperCase() ?? "";
  if (!upper || !hasFlag(upper)) return null;

  const FlagComponent = Flags[upper as FlagKey];
  if (!FlagComponent) return null;

  return <FlagComponent title={title ?? upper} className={className} />;
}
