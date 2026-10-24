"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP, MOTION_CONDITIONS, type MotionConditions } from "@/lib/gsap";
import { useIntro } from "@/components/providers/IntroProvider";

/**
 * Each hero letter has its own resting pose, matching the scattered
 * "PoRtfoLio" lettering in the design.
 *  size  – relative font size (em)
 *  rot   – resting rotation in degrees
 *  x / y – resting offset in hundredths of an em
 *  depth – parallax strength (1 = moves the full 20px)
 */
type Letter = { ch: string; size: number; rot: number; x: number; y: number; depth: number };

const LETTERS: Letter[] = [
  { ch: "P", size: 1.35, rot: -4, x: 0, y: 2, depth: 0.9 },
  { ch: "O", size: 0.95, rot: 0, x: -4, y: 30, depth: 0.5 },
  { ch: "R", size: 0.85, rot: 14, x: -6, y: -20, depth: 0.75 },
  { ch: "t", size: 1.45, rot: 0, x: -4, y: -18, depth: 1 },
  { ch: "f", size: 1.05, rot: 7, x: -4, y: 0, depth: 0.6 },
  { ch: "o", size: 0.95, rot: 0, x: -5, y: 16, depth: 0.85 },
  { ch: "L", size: 1.05, rot: -3, x: -5, y: 2, depth: 0.55 },
  { ch: "i", size: 0.85, rot: -10, x: -4, y: 10, depth: 0.7 },
  { ch: "o", size: 1, rot: 0, x: -5, y: 30, depth: 0.65 },
];

const PARALLAX_MAX = 20; // px

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return; // wait for the loader to finish
      const q = gsap.utils.selector(root);
      const yearNum = q(".js-year-num")[0] as HTMLElement;
      const mm = gsap.matchMedia();

      mm.add(MOTION_CONDITIONS, (ctx) => {
        const { motion: canMove } = ctx.conditions as MotionConditions;
        const letters = q(".js-drop");

        // ── Reduced motion: everything simply fades in ──────────────────
        if (!canMove) {
          yearNum.textContent = "26";
          gsap.to([...letters, ...q(".js-char"), ...q(".js-year"), ...q(".js-name")], {
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.03,
          });
          return;
        }

        const tl = gsap.timeline({ delay: 0.15 });

        // 1. LETTERS DROP IN — each starts just above the viewport with a
        //    random tilt, then lands with an elastic bounce, one after another,
        //    like tiles dropped on a table. (Opacity is a separate quick tween
        //    so it doesn't "bounce" with the elastic ease.)
        tl.fromTo(
          letters,
          {
            y: (_i: number, el: HTMLElement) => -(el.getBoundingClientRect().bottom + 80),
            rotation: () => gsap.utils.random(-35, 35),
          },
          { y: 0, rotation: 0, duration: 1.4, ease: "elastic.out(1, 0.45)", stagger: 0.08 },
          0,
        ).fromTo(letters, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, stagger: 0.08 }, 0);

        // 2. CHARACTER REVEAL — the image slides up inside an overflow-hidden
        //    mask, so it appears to rise from behind the letters.
        tl.fromTo(q(".js-char"), { yPercent: 105, autoAlpha: 1 }, { yPercent: 0, duration: 1.1, ease: "power4.out" }, 0.75);

        // 3. YEAR COUNTER — '00 → '26 once the letters have landed.
        const count = { v: 0 };
        tl.set(q(".js-year"), { autoAlpha: 1 }, 1.5).to(
          count,
          {
            v: 26,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => {
              yearNum.textContent = String(Math.round(count.v)).padStart(2, "0");
            },
          },
          1.5,
        );

        // 4. NAME fades in last.
        tl.fromTo(q(".js-name"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 2.2);

        // 5. IDLE FLOAT — the character bobs gently forever after its reveal.
        gsap.to(q(".js-float"), { y: -12, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });

        // 6. MOUSE PARALLAX — every [data-depth] layer follows the cursor by
        //    up to 20px × depth. Negative depth moves the opposite way, which
        //    pushes the character "in front of" the letters.
        const movers = q("[data-depth]").map((el) => ({
          depth: Number((el as HTMLElement).dataset.depth),
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
        }));
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          movers.forEach((m) => {
            m.x(nx * PARALLAX_MAX * m.depth);
            m.y(ny * PARALLAX_MAX * m.depth);
          });
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-12 pt-20 md:px-8"
    >
      <h1 className="sr-only">Choki Zangmo — Restaurant Manager, Portfolio 2026</h1>

      {/* Shared font-size: letters, the character's overlap and the year all scale together. */}
      <div className="relative w-full max-w-[1040px] text-[clamp(3.4rem,15vw,11.5rem)]">
        {/* '26 */}
        <p
          aria-hidden="true"
          data-depth="0.35"
          className="js-year invisible absolute right-[3%] top-[-0.15em] z-20 font-display text-[0.42em] leading-none text-beige"
        >
          ’<span className="js-year-num tabular-nums">00</span>
        </p>

        {/* PORTFOLIO letters */}
        <div
          aria-hidden="true"
          className="relative z-0 flex select-none items-end justify-center font-display leading-[0.8] tracking-[-0.03em] text-ink"
        >
          {LETTERS.map((l, i) => (
            // Layer 1: resting pose (CSS translate/rotate) + parallax (GSAP transform).
            <span
              key={i}
              data-depth={l.depth}
              className="inline-block will-change-transform"
              style={{ fontSize: `${l.size}em`, translate: `${l.x / 100}em ${l.y / 100}em`, rotate: `${l.rot}deg` }}
            >
              {/* Layer 2: the drop-in animation (GSAP). */}
              <span className="js-drop invisible inline-block">
                {/* Layer 3: hover wobble (Framer Motion) — tilt back and forth and grow slightly. */}
                <motion.span
                  className="inline-block origin-bottom"
                  whileHover={{ rotate: [0, -12, 9, -5, 0], scale: 1.12, transition: { duration: 0.6 } }}
                  whileTap={{ rotate: [0, -12, 9, -5, 0], scale: 1.12, transition: { duration: 0.6 } }}
                >
                  {l.ch}
                </motion.span>
              </span>
            </span>
          ))}
        </div>

        {/* Character: parallax wrapper → idle float → mask → revealed image */}
        <div data-depth="-0.45" className="relative z-10 mx-auto -mt-[0.75em] w-[min(56vw,460px)] md:-mt-[0.95em]">
          <div className="js-float">
            <div className="overflow-hidden">
              <div className="js-char invisible">
                <Image
                  src="/images/character.png"
                  alt="Illustrated portrait of Choki Zangmo"
                  width={500}
                  height={500}
                  priority
                  sizes="(min-width: 820px) 460px, 56vw"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Name — below the character on phones; tucked under the "P" from tablet up.
            The wrapper inherits the shared font-size, so top-[1.15em] tracks the letters. */}
        <div className="mt-4 md:absolute md:left-[2%] md:top-[1.15em] md:z-20 md:mt-0">
          <p className="js-name invisible text-center text-[clamp(1rem,1.8vw,1.5rem)] font-bold uppercase leading-tight tracking-wide text-beige-ink md:text-left">
            Choki Zangmo
          </p>
        </div>
      </div>
    </section>
  );
}
