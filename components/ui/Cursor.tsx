"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gsap } from "@/lib/gsap";

/**
 * CUSTOM CURSOR
 * - A small dot follows the mouse with gsap.quickTo (a light lag feels tactile).
 * - Hovering anything with a data-cursor="Label" attribute grows the dot into
 *   a circle showing that label ("View" on project cards, "Drag" on the ID card).
 * - Only enabled on devices with a real mouse; touch devices keep nothing extra.
 * The grow is a scale on a fixed-size circle, so it's transform-only.
 */
export default function Cursor() {
  const pos = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches || !pos.current) return;

    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    gsap.set(pos.current, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(pos.current, "x", { duration: 0.22, ease: "power3" });
    const yTo = gsap.quickTo(pos.current, "y", { duration: 0.22, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setVisible(true);
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
    };
    const onLeaveWindow = () => setVisible(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeaveWindow);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  const active = Boolean(label);

  return (
    <div
      ref={pos}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[120] ${enabled ? "" : "hidden"}`}
    >
      <motion.div
        className={`flex h-20 w-20 items-center justify-center rounded-full ${
          active ? "bg-ink" : "bg-paper mix-blend-difference"
        }`}
        initial={false}
        animate={{ scale: visible ? (active ? 1 : 0.15) : 0, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        <motion.span
          className="text-sm font-semibold text-paper"
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </div>
  );
}
