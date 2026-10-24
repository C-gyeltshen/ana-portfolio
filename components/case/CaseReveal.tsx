"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Case-study entrance: children fade up one after another once the
 * colour wipe from the home page has landed.
 */
export default function CaseReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
      }}
    >
      {children}
    </motion.div>
  );
}
