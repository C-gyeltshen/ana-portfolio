"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGroup, motion } from "motion/react";
import { gsap, useGSAP, MOTION_CONDITIONS, type MotionConditions } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/hooks";
import { projects, type Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

type Expanding = { project: Project; rect: DOMRect };

/**
 * PROJECT CARDS SECTION
 * • Layout: 1 column on phones, 2 on tablets (5th card full width), and five
 *   tall panels in a row from 1024px with a real mouse.
 * • Accordion: `active` index → hovered card gets flex-grow 2.6, others 1.
 * • Numbers: GSAP slides every .js-num up from below the panel edge,
 *   staggered 1 → 5, when the list scrolls into view.
 * • Card click: <ExpandOverlay> grows from the panel's rect to full screen,
 *   then routes to /projects/[slug] (whose hero is the same colour).
 */
export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const desktop = useMediaQuery("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
  const [active, setActive] = useState<number | null>(null);
  const [expanding, setExpanding] = useState<Expanding | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_CONDITIONS, (ctx) => {
        const { motion } = ctx.conditions as MotionConditions;
        const trigger = { trigger: q(".js-list")[0], start: "top 80%", once: true };
        if (!motion) {
          gsap.from(q(".js-num"), { autoAlpha: 0, duration: 0.6, scrollTrigger: trigger });
          return;
        }
        gsap.fromTo(
          q(".js-num"),
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.12, scrollTrigger: trigger },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" aria-label="Projects" className="px-4 pb-24 md:px-8 md:pb-32">
      <LayoutGroup>
        <ul
          className="js-list mx-auto flex max-w-[1200px] flex-col gap-8 md:grid md:grid-cols-2 md:gap-x-5 md:gap-y-10 lg:flex lg:h-[clamp(480px,68vh,640px)] lg:flex-row lg:gap-4"
          onPointerLeave={() => setActive(null)}
        >
          {projects.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              index={i}
              desktop={desktop}
              active={desktop && active === i}
              onActivate={() => setActive(i)}
              onPrefetch={() => router.prefetch(`/projects/${p.slug}`)}
              onOpen={(panel) => setExpanding({ project: p, rect: panel.getBoundingClientRect() })}
            />
          ))}
        </ul>
      </LayoutGroup>

      {expanding && (
        <ExpandOverlay
          color={expanding.project.color}
          rect={expanding.rect}
          onDone={() => router.push(`/projects/${expanding.project.slug}`)}
        />
      )}
    </section>
  );
}

/**
 * Full-screen colour wipe. The overlay is always viewport-sized; it starts
 * scaled and translated to sit exactly on the card's panel (transform-origin
 * top-left), then animates to scale 1 / translate 0.
 */
function ExpandOverlay({ color, rect, onDone }: { color: string; rect: DOMRect; onDone: () => void }) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[110]"
      style={{ backgroundColor: color, originX: 0, originY: 0 }}
      initial={{ x: rect.left, y: rect.top, scaleX: rect.width / vw, scaleY: rect.height / vh }}
      animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1 }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onDone}
    />
  );
}
