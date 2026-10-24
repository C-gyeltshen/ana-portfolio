"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so Lenis and ScrollTrigger
 * share one requestAnimationFrame loop (no jitter between them).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();

  // Drive Lenis from the GSAP ticker (time is in seconds → Lenis wants ms).
  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  // Reduced motion: keep native, instant wheel scrolling.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (lenis) lenis.options.smoothWheel = !reduced;
  }, [reduced]);

  // On route change, jump to the top (or to a #hash such as /#work).
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;
    const hash = window.location.hash;
    requestAnimationFrame(() => {
      if (hash && document.querySelector(hash)) lenis.scrollTo(hash, { immediate: true, force: true });
      else lenis.scrollTo(0, { immediate: true, force: true });
      ScrollTrigger.refresh();
    });
  }, [pathname]);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1, smoothWheel: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

/** Tell ScrollTrigger to recalculate every time Lenis scrolls. */
function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}
