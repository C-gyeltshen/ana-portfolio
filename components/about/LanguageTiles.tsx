"use client";

import { motion } from "motion/react";

/**
 * LANGUAGE TILES
 * Neutral tiles with each language's code and an accent-colour dot.
 *
 * Animations:
 * • Pop-in: GSAP scales each `.js-icon` from 0 with a back-out bounce, one
 *   after another (wired up in About.tsx).
 * • Hover/focus: Framer lifts the tile 6px and fades in a blurred glow in the
 *   accent colour (opacity + transform only).
 */
const LANGUAGES = [
  { name: "English", short: "EN", color: "#5A78D1" },
  { name: "Arabic", short: "AR", color: "#A9BE84" },
  { name: "Hindi", short: "HI", color: "#E25A4F" },
  { name: "Nepali", short: "NE", color: "#819CE3" },
];

export default function LanguageTiles() {
  return (
    <ul className="js-icons flex flex-wrap gap-3" aria-label="Languages I speak">
      {LANGUAGES.map((t) => (
        <li key={t.name} className="js-icon">
          <motion.div
            className="relative"
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileFocus="hover"
            tabIndex={0}
            title={t.name}
            aria-label={t.name}
            variants={{ rest: { y: 0 }, hover: { y: -6 } }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl blur-lg"
              style={{ background: t.color }}
              variants={{ rest: { opacity: 0, scale: 0.8 }, hover: { opacity: 0.55, scale: 1.15 } }}
            />
            <span
              aria-hidden="true"
              className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-ink/10 bg-paper text-base font-semibold shadow-[0_2px_0_rgba(0,0,0,0.08)]"
            >
              {t.short}
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: t.color }} />
            </span>
          </motion.div>
        </li>
      ))}
    </ul>
  );
}
