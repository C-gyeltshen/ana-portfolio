"use client";

import { useRef } from "react";
import { motion, useSpring } from "motion/react";
import type { Project } from "@/lib/projects";
import CardIcon from "./CardIcon";

type Props = {
  project: Project;
  index: number;
  /** true on wide screens with a real mouse → hover accordion + 3D tilt */
  desktop: boolean;
  active: boolean;
  onActivate: () => void;
  onOpen: (panel: HTMLElement) => void;
  onPrefetch: () => void;
};

const LAYOUT_SPRING = { type: "spring", stiffness: 260, damping: 30 } as const;

/**
 * PROJECT CARD
 * • Accordion (desktop): the <li> animates its flex-grow change with a Framer
 *   `layout` animation (performed with transforms). Children use
 *   layout="position" so the icon, number and text don't stretch.
 * • 3D tilt: on the hovered card, pointer position maps to rotateX/rotateY
 *   springs on the icon wrapper (perspective lives on its parent).
 * • The giant number (.js-num) is clipped by the panel's overflow-hidden and
 *   slid up by GSAP in Projects.tsx.
 * • Click: hands the coloured panel element to the parent, which grows a
 *   full-screen overlay from it and then routes.
 */
export default function ProjectCard({ project, index, desktop, active, onActivate, onOpen, onPrefetch }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 160, damping: 14 });
  const ry = useSpring(0, { stiffness: 160, damping: 14 });

  const tilt = (e: React.PointerEvent) => {
    if (!desktop || e.pointerType !== "mouse" || !panel.current) return;
    const r = panel.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 26);
    rx.set(-py * 20);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  const pos = desktop ? ("position" as const) : false;
  // On tablets the 5th card spans both columns, so its panel is wider and shorter.
  const isLast = index === 4;

  return (
    <motion.li
      layout={desktop}
      transition={LAYOUT_SPRING}
      className="relative min-w-0 md:last:col-span-2 lg:basis-0 lg:last:col-span-1"
      style={desktop ? { flexGrow: active ? 2.6 : 1 } : undefined}
      onPointerEnter={() => {
        onActivate();
        onPrefetch();
      }}
    >
      <a
        href={`/projects/${project.slug}`}
        data-cursor="View"
        onFocus={onActivate}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || !panel.current) return;
          e.preventDefault();
          onOpen(panel.current);
        }}
        className="flex h-full flex-col rounded-md focus-visible:outline-offset-4"
      >
        <motion.div
          ref={panel}
          layout={desktop}
          transition={LAYOUT_SPRING}
          onPointerMove={tilt}
          onPointerLeave={resetTilt}
          className={`relative aspect-square overflow-hidden rounded-md shadow-[0_2px_0_rgba(0,0,0,0.06)] ${
            isLast ? "md:aspect-[2/1]" : "md:aspect-[4/5]"
          } lg:aspect-auto lg:flex-1`}
          style={{ backgroundColor: project.color }}
        >
          {/* Icon: layout wrapper (no stretch) → perspective → tilting icon */}
          <motion.div
            layout={pos}
            transition={LAYOUT_SPRING}
            className="absolute inset-x-0 top-[9%] flex justify-center [perspective:900px] lg:top-[12%]"
          >
            <motion.div
              style={{ rotateX: rx, rotateY: ry }}
              className="w-[40%] max-w-[190px] lg:w-[min(64%,190px)]"
            >
              <CardIcon kind={project.icon} />
            </motion.div>
          </motion.div>

          {/* Giant number, clipped by the panel's bottom edge until GSAP slides it up */}
          <motion.div
            layout={pos}
            transition={LAYOUT_SPRING}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
          >
            <span className="js-num block translate-y-[0.06em] text-[clamp(7rem,26vw,11rem)] font-bold leading-[0.78] text-paper lg:text-[clamp(7rem,10vw,10.5rem)]">
              {index + 1}
            </span>
          </motion.div>
        </motion.div>

        <motion.div layout={pos} transition={LAYOUT_SPRING} className="pt-3 lg:min-h-[6.75rem]">
          <p className="text-base font-semibold uppercase tracking-wide">{project.title}</p>
          <p className="text-base leading-snug text-ink/70">{project.description}</p>
        </motion.div>
      </a>
    </motion.li>
  );
}
