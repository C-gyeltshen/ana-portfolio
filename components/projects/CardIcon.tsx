import type { IconKind } from "@/lib/projects";

/** Large white line icons (inline SVG, stroke only) shown in each card. */
export default function CardIcon({ kind }: { kind: IconKind }) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-auto w-full drop-shadow-[0_14px_18px_rgba(0,0,0,0.18)]"
    >
      {PATHS[kind]}
    </svg>
  );
}

const PATHS: Record<IconKind, React.ReactNode> = {
  briefcase: (
    <>
      <rect x="10" y="28" width="76" height="52" rx="6" />
      <path d="M34 28v-8a4 4 0 014-4h20a4 4 0 014 4v8" />
      <path d="M10 52h76" />
      <path d="M42 52v6h12v-6" />
    </>
  ),
  target: (
    <>
      <circle cx="48" cy="48" r="34" />
      <circle cx="48" cy="48" r="22" />
      <circle cx="48" cy="48" r="10" />
      <path d="M48 48l26-26" />
      <path d="M66 20h10v10" />
    </>
  ),
  cap: (
    <>
      <path d="M48 18L6 38l42 20 42-20-42-20z" />
      <path d="M24 48v16c0 6 10 12 24 12s24-6 24-12V48" />
      <path d="M90 38v22" />
    </>
  ),
  chat: (
    <>
      <path d="M12 18h44a6 6 0 016 6v26a6 6 0 01-6 6H32l-12 10V56h-8a6 6 0 01-6-6V24a6 6 0 016-6z" transform="translate(0 -2)" />
      <path d="M70 38h14a6 6 0 016 6v26a6 6 0 01-6 6h-4v10L68 76H46a6 6 0 01-6-6v-4" />
    </>
  ),
  mail: (
    <>
      <rect x="8" y="20" width="80" height="56" rx="6" />
      <path d="M8 28l40 28 40-28" />
    </>
  ),
};
