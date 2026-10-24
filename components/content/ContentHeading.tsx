"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_CONDITIONS, type MotionConditions } from "@/lib/gsap";

/** Resting positions of the numbers over the word, in % of the word box. */
const NUMBERS = [
  { n: "01", left: "13%", top: "18%" },
  { n: "02", left: "31%", top: "60%" },
  { n: "03", left: "45%", top: "-14%" },
  { n: "04", left: "61%", top: "56%" },
  { n: "05", left: "78%", top: "-8%" },
];

/**
 * "CONTENT" HEADING
 * • Outlined word + a solid copy on top. The solid copy sits in a mask that
 *   starts at xPercent -100 while the text inside starts at xPercent +100, so
 *   they cancel out and nothing shows. Scrubbing both to 0 reveals the fill
 *   from left to right. Transform-only, no clip-path or width animation.
 * • Numbers start scattered (random x / y / rotation) and settle into place as
 *   the same scroll progresses; an inner layer keeps them floating gently.
 */
export default function ContentHeading() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mask = q(".js-fill-mask")[0];
      const inner = q(".js-fill-inner")[0];
      const nums = q(".js-num-pos");
      const mm = gsap.matchMedia();

      mm.add(MOTION_CONDITIONS, (ctx) => {
        const { motion } = ctx.conditions as MotionConditions;
        gsap.set(mask, { autoAlpha: 1 });

        if (!motion) {
          // Reduced motion: show the filled word, fade the numbers in.
          gsap.from(nums, { autoAlpha: 0, duration: 0.6, stagger: 0.05, scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom 35%", scrub: 1 },
        });
        tl.fromTo(mask, { xPercent: -100 }, { xPercent: 0, ease: "none" }, 0)
          .fromTo(inner, { xPercent: 100 }, { xPercent: 0, ease: "none" }, 0)
          .fromTo(
            nums,
            {
              x: () => gsap.utils.random(-220, 220),
              y: () => gsap.utils.random(-160, 160),
              rotation: () => gsap.utils.random(-50, 50),
            },
            { x: 0, y: 0, rotation: 0, ease: "power2.out", duration: 0.8 },
            0,
          );

        // Idle float on the inner layer (independent of the scrubbed layer).
        q(".js-num-float").forEach((el) => {
          gsap.to(el, {
            y: gsap.utils.random(-10, 10),
            x: gsap.utils.random(-6, 6),
            rotation: gsap.utils.random(-6, 6),
            duration: gsap.utils.random(1.6, 2.6),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="content-title" className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28">
      <h2 id="content-title" className="sr-only">
        Content — about Choki
      </h2>
      <div aria-hidden="true" className="relative mx-auto max-w-[1100px] select-none">
        <div className="relative text-center text-[clamp(3.6rem,18vw,15rem)] font-bold leading-none tracking-tight">
          <span className="block text-transparent [-webkit-text-stroke:2px_#cfcfcf]">CONTENT</span>
          <span className="js-fill-mask invisible absolute inset-0 overflow-hidden">
            <span className="js-fill-inner block text-ink">CONTENT</span>
          </span>
        </div>

        {NUMBERS.map((x) => (
          <span key={x.n} className="js-num-pos absolute block" style={{ left: x.left, top: x.top }}>
            <span className="js-num-float block text-[clamp(1.6rem,6.5vw,5rem)] font-bold leading-none text-beige">
              {x.n}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
