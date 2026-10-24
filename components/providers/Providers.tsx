"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { IntroProvider } from "./IntroProvider";
import SmoothScroll from "./SmoothScroll";
import Loader from "@/components/ui/Loader";
import Cursor from "@/components/ui/Cursor";

/**
 * Everything client-side that wraps the whole site.
 * MotionConfig reducedMotion="user" makes every Framer Motion animation
 * skip transform animations when the OS asks for reduced motion.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <IntroProvider>
      <MotionConfig reducedMotion="user">
        <SmoothScroll>
          <Loader />
          <Cursor />
          {children}
        </SmoothScroll>
      </MotionConfig>
    </IntroProvider>
  );
}
