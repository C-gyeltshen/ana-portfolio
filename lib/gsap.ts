"use client";

/**
 * Central GSAP setup.
 * Every component imports gsap from here so the plugins are registered
 * exactly once (ScrollTrigger for scroll-linked animation, SplitText for
 * word/line splitting, useGSAP for automatic cleanup in React).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** Media-query conditions used with gsap.matchMedia() in every section. */
export const MOTION_CONDITIONS = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export type MotionConditions = { motion: boolean; reduce: boolean };

export { gsap, ScrollTrigger, SplitText, useGSAP };
