"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Tiny shared flag: the Loader flips `ready` to true when its counter hits
 * 100%, and the Hero waits for it before playing its entrance timeline.
 * Lives in the root layout, so it stays true when you navigate back home
 * from a case study (the loader doesn't replay).
 */
type IntroState = { ready: boolean; setReady: (v: boolean) => void };

const IntroContext = createContext<IntroState>({ ready: false, setReady: () => {} });

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return <IntroContext.Provider value={{ ready, setReady }}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
