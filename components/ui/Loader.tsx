"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/components/providers/IntroProvider";

/**
 * PAGE LOADER
 * 1. Counter tweens 0 → 100% (scroll is locked meanwhile).
 * 2. At 100% we flip `ready`, which starts the Hero timeline underneath.
 * 3. The black panel slides up off-screen (yPercent -100) and unmounts.
 * Reduced motion: shorter count and a plain fade instead of the slide.
 */
export default function Loader() {
  const { ready, setReady } = useIntro();
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Lock scrolling while the loader is on screen.
  useEffect(() => {
    if (done) lenis?.start();
    else lenis?.stop();
  }, [lenis, done]);

  useGSAP(
    () => {
      // Already played this session (e.g. navigating back from a case study).
      if (ready) {
        setDone(true);
        return;
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const counter = { v: 0 };

      gsap
        .timeline({ onComplete: () => setDone(true) })
        .to(counter, {
          v: 100,
          duration: reduce ? 0.6 : 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            if (num.current) num.current.textContent = String(Math.round(counter.v));
          },
        })
        // Progress bar grows with the counter (scaleX, so it's GPU-only).
        .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: reduce ? 0.6 : 1.6, ease: "power2.inOut" }, 0)
        .add(() => setReady(true), "+=0.1")
        .to(
          root.current,
          reduce
            ? { autoAlpha: 0, duration: 0.4 }
            : { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
          "<",
        );
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-ink p-6 text-paper md:p-10"
    >
      <div className="flex items-end justify-between gap-6">
        <p className="font-display text-[clamp(1.5rem,4vw,2.5rem)] leading-none">Portfolio ’26</p>
        <p className="font-display text-[clamp(4rem,16vw,11rem)] leading-[0.8] tabular-nums">
          <span ref={num}>0</span>
          <span className="text-beige">%</span>
        </p>
      </div>
      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-paper/15">
        <div ref={bar} className="h-full w-full origin-left scale-x-0 rounded-full bg-beige" />
      </div>
    </div>
  );
}
