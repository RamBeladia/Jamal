"use client";

import { useScrollReveal } from "@/lib/hooks";

/** Mounts the IntersectionObserver that drives .reveal / .stagger / .divider. */
export function ScrollReveal() {
  useScrollReveal();
  return null;
}
