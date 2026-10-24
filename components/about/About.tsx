"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_CONDITIONS, type MotionConditions } from "@/lib/gsap";
import Lanyard from "./Lanyard";
import LanguageTiles from "./LanguageTiles";
import Magnetic from "@/components/ui/Magnetic";

const EXPERIENCE = [{ role: "Manager at Elevation Burger", dates: "17 Jan 2023 – Present · Kuwait" }];

const EDUCATION = [
  {
    role: "Higher Secondary Education (Class XII)",
    dates: "Samtse Higher Secondary School, Samtse, Bhutan · Completed 2018",
  },
  { role: "Languages", dates: "English, Arabic, Hindi, Nepali" },
  { role: "References", dates: "Available upon request" },
];

const CONTACTS = [
  { label: "Phone", value: "+965 69961872", href: "tel:+96569961872", icon: "phone" },
  { label: "WhatsApp", value: "+965 69961872", href: "https://wa.me/96569961872", icon: "chat" },
  { label: "Email", value: "Choe@gmail.com", href: "mailto:Choe@gmail.com", icon: "mail" },
  { label: "Location", value: "Kuwait", href: null, icon: "pin" },
] as const;

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_CONDITIONS, (ctx) => {
        const { motion } = ctx.conditions as MotionConditions;
        const heading = q(".js-hi")[0];
        const intro = q(".js-intro")[0];

        if (!motion) {
          // Reduced motion: plain fades on scroll, no splitting or bouncing.
          ScrollTrigger.batch([heading, intro, ...q(".js-reveal"), ...q(".js-icon")], {
            start: "top 90%",
            once: true,
            onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }),
          });
          return;
        }

        // 1. HEADING, WORD BY WORD — each word rises out of its own mask with
        //    a little tilt and overshoot. autoSplit re-splits on resize/font load.
        SplitText.create(heading, {
          type: "words",
          mask: "words",
          maskClass: "split-mask",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 115,
              rotation: 8,
              duration: 0.9,
              ease: "back.out(1.8)",
              stagger: 0.09,
              scrollTrigger: { trigger: heading, start: "top 85%", once: true },
            }),
        });

        // 2. INTRO PARAGRAPH, LINE BY LINE — lines slide up from masks.
        SplitText.create(intro, {
          type: "lines",
          mask: "lines",
          maskClass: "split-mask",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              autoAlpha: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: { trigger: intro, start: "top 85%", once: true },
            }),
        });

        // 3. COLUMNS + CONTACT LINKS — staggered fade-up as they enter.
        gsap.set(q(".js-reveal"), { autoAlpha: 0, y: 32 });
        ScrollTrigger.batch(q(".js-reveal"), {
          start: "top 90%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }),
        });

        // 4. SOFTWARE ICONS — pop in one after another with a scale bounce.
        gsap.fromTo(
          q(".js-icon"),
          { scale: 0, rotation: -20 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(3)",
            stagger: 0.08,
            scrollTrigger: { trigger: q(".js-icons")[0], start: "top 92%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="relative px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-[1200px] items-start gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
        {/* Lanyard hangs from the top of the section */}
        <div className="-mt-20 md:-mt-28">
          <Lanyard />
        </div>

        <div className="min-w-0 lg:pt-36">
          <h2 id="about-title" className="js-hi text-[clamp(2rem,1.4rem+2.4vw,3rem)] font-semibold leading-tight">
            Hi, I’m <span className="text-beige-ink">Choki</span>
          </h2>
          <p className="js-intro mt-4 max-w-3xl text-base leading-relaxed text-ink/75 md:text-lg">
            I’m a Restaurant Manager specialising in Food & Beverage Operations, currently managing at Elevation Burger in
            Kuwait. Originally from Bhutan, I’m open to Restaurant Manager, F&B Manager and Operations Manager roles.
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.15fr] lg:gap-0">
            <Column title="Experience" items={EXPERIENCE} />
            <Column title="Education & Languages" items={EDUCATION} divider />

            <div className="md:col-span-2 lg:col-span-1 lg:border-l lg:border-ink/15 lg:pl-8">
              <h3 className="js-reveal mb-4 text-base font-semibold uppercase tracking-wider">Contact</h3>
              <ul className="flex flex-col gap-2">
                {CONTACTS.map((c) => (
                  <li key={c.label} className="js-reveal">
                    {c.href ? (
                      <Magnetic>
                        <a
                          href={c.href}
                          target={c.href.startsWith("http") ? "_blank" : undefined}
                          rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                          className="group flex min-h-11 items-center gap-3 rounded-full py-1 pr-4 text-[15px] leading-snug"
                        >
                          <ContactBody c={c} />
                        </a>
                      </Magnetic>
                    ) : (
                      <div className="group flex min-h-11 items-center gap-3 py-1 pr-4 text-[15px] leading-snug">
                        <ContactBody c={c} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <h3 className="js-reveal mb-4 mt-8 text-base font-semibold uppercase tracking-wider">Languages</h3>
              <LanguageTiles />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Column({
  title,
  items,
  divider = false,
}: {
  title: string;
  items: { role: string; dates: string }[];
  divider?: boolean;
}) {
  return (
    <div className={divider ? "lg:border-l lg:border-ink/15 lg:px-8" : "lg:pr-8"}>
      <h3 className="js-reveal mb-4 text-base font-semibold uppercase tracking-wider">{title}</h3>
      <ul className="flex flex-col gap-4">
        {items.map((it, i) => (
          <li key={i} className="js-reveal">
            <p className="text-base font-medium leading-snug">{it.role}</p>
            <p className="text-sm text-ink/60">{it.dates}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactBody({ c }: { c: (typeof CONTACTS)[number] }) {
  const Icon = { phone: PhoneIcon, chat: ChatIcon, mail: MailIcon, pin: PinIcon }[c.icon];
  return (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-paper transition-transform group-hover:-rotate-6">
        <Icon />
      </span>
      <span>
        <span className="block text-sm text-ink/60">{c.label}</span>
        <span className="block font-medium [overflow-wrap:anywhere] lg:text-sm">{c.value}</span>
      </span>
    </>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 01-11.7 7.1L3 21l1.9-6.3A8 8 0 1121 12z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
