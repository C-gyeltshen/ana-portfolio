"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";

/** Resting length of the strap, from the pivot to the card's clip (px). */
const STRAP = 190;

/**
 * LANYARD + ID CARD — a 2D pendulum built from Framer Motion springs.
 *
 * • x / y are the card's offset from its resting point (the user drags these).
 * • The strap angle is atan2(x, STRAP + y): the card and strap both rotate by
 *   that angle around the pivot, so the card always hangs off the strap end.
 * • Idle: x is gently swung back and forth forever.
 * • Release: x springs home with low damping (it overshoots and swings like a
 *   pendulum), while y springs home critically damped (no bobbing).
 * Everything is transform-only: the strap is a div that rotates and stretches
 * with scaleY, the card translates and rotates.
 * Reduced motion: no drag, no swing — the card just hangs.
 */
export default function Lanyard() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const idle = useRef<AnimationPlaybackControls | null>(null);

  // CSS rotate is clockwise-positive, so a card pulled right rotates negatively.
  const angle = useTransform(() => (-Math.atan2(x.get(), STRAP + y.get()) * 180) / Math.PI);
  // How much the strap must stretch to reach the card.
  const stretch = useTransform(() => Math.hypot(x.get(), STRAP + y.get()) / STRAP);

  const startIdle = useCallback(() => {
    if (reduce) return;
    idle.current?.stop();
    idle.current = animate(x, [0, 12, 0, -12, 0], { duration: 4.5, ease: "easeInOut", repeat: Infinity });
  }, [reduce, x]);

  useEffect(() => {
    startIdle();
    return () => idle.current?.stop();
  }, [startIdle]);

  const release = () => {
    animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
    animate(x, 0, { type: "spring", stiffness: 90, damping: 4.5, restDelta: 0.5, onComplete: startIdle });
  };

  return (
    <div className="relative mx-auto h-[560px] w-[260px] select-none sm:h-[580px]">
      {/* Pivot hook */}
      <div className="absolute left-1/2 top-0 z-20 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-neutral-400 bg-paper" />

      {/* Strap: two-tone fabric ribbon, rotates + stretches from the pivot */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-2 z-10 -ml-[11px] w-[22px] origin-top rounded-b-sm border-x border-neutral-300 bg-[repeating-linear-gradient(90deg,#f4f4f4_0_7px,#e4e4e4_7px_8px)] shadow-sm"
        style={{ height: STRAP, rotate: angle, scaleY: stretch }}
      />

      {/* Card */}
      <motion.div
        data-cursor={reduce ? undefined : "Drag"}
        drag={!reduce}
        dragMomentum={false}
        onDragStart={() => idle.current?.stop()}
        onDragEnd={release}
        className="absolute left-1/2 z-30 -ml-[105px] w-[210px] touch-none"
        style={{ top: STRAP, x, y, rotate: angle, transformOrigin: "50% 0%" }}
        whileDrag={{ scale: 1.03 }}
      >
        {/* Metal clip */}
        <div className="mx-auto h-7 w-9 rounded-md border-2 border-neutral-400 bg-neutral-200" />
        <div className="mx-auto -mt-1 h-3 w-4 rounded-b bg-neutral-400" />

        {/* Plastic sleeve */}
        <div className="mt-1 rounded-2xl border border-neutral-300 bg-[#eef1f4] p-3 shadow-[0_24px_40px_-14px_rgba(0,0,0,0.35)]">
          <div className="mx-auto mb-3 h-2 w-12 rounded-full bg-neutral-300" />
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-beige">
            <Image
              src="/images/photo.jpg"
              alt="Portrait of Choki Zangmo"
              fill
              sizes="210px"
              draggable={false}
              className="pointer-events-none object-cover"
            />
          </div>
          <p className="mt-3 text-center text-base font-semibold leading-tight">Choki Zangmo</p>
          <p className="text-center text-sm text-ink/60">Restaurant Manager</p>
        </div>
      </motion.div>
    </div>
  );
}
