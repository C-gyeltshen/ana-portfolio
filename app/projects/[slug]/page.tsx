import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import CaseReveal, { RevealItem } from "@/components/case/CaseReveal";
import CardIcon from "@/components/projects/CardIcon";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return { title: p ? `${p.title} — Choki Zangmo` : "Project not found" };
}

const CARD = "rounded-2xl border border-ink/10 bg-paper p-6 text-lg font-semibold shadow-[0_2px_0_rgba(0,0,0,0.06)]";
const LINK = "underline decoration-ink/30 underline-offset-4 hover:decoration-ink";

function Body({ slug }: { slug: string }) {
  switch (slug) {
    case "experience":
      return (
        <article>
          <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] font-semibold">Manager, Elevation Burger, Kuwait</h2>
          <p className="mt-3 text-base text-ink/75 md:text-lg">17 January 2023 – Present (currently employed)</p>
        </article>
      );
    case "target-roles":
      return (
        <ul className="grid gap-4 sm:grid-cols-2">
          {["Restaurant Manager", "F&B Manager", "Operations Manager", "Food Company Management roles"].map((r) => (
            <li key={r} className={CARD}>
              {r}
            </li>
          ))}
        </ul>
      );
    case "education":
      return (
        <article>
          <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] font-semibold">Higher Secondary Education (Class XII)</h2>
          <p className="mt-3 text-base text-ink/75 md:text-lg">Samtse Higher Secondary School, Samtse, Bhutan, completed 2018</p>
        </article>
      );
    case "languages":
      return (
        <div>
          <ul className="flex flex-wrap gap-3">
            {["English", "Arabic", "Hindi", "Nepali"].map((l) => (
              <li
                key={l}
                className="rounded-full border border-ink/10 bg-paper px-8 py-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] font-semibold"
              >
                {l}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-base text-ink/75 md:text-lg">References available upon request</p>
        </div>
      );
    default:
      return (
        <dl className="grid gap-6">
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wider text-ink/60">Phone / WhatsApp</dt>
            <dd className="mt-1 text-lg font-medium">
              <a href="tel:+96569961872" className={LINK}>
                +965 69961872
              </a>
              {" · "}
              <a href="https://wa.me/96569961872" target="_blank" rel="noreferrer" className={LINK}>
                WhatsApp
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wider text-ink/60">Email</dt>
            <dd className="mt-1 text-lg font-medium">
              <a href="mailto:Choe@gmail.com" className={LINK}>
                Choe@gmail.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wider text-ink/60">Location</dt>
            <dd className="mt-1 text-lg font-medium">Kuwait</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wider text-ink/60">Nationality</dt>
            <dd className="mt-1 text-lg font-medium">Bhutanese</dd>
          </div>
        </dl>
      );
  }
}

/** Detail page. The hero uses the card's colour so the wipe from the home page feels continuous. */
export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <main>
      <section
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-4 pb-12 pt-28 md:px-8 md:pb-16"
        style={{ backgroundColor: project.color }}
      >
        <Link
          href="/#work"
          className="absolute left-4 top-5 inline-flex min-h-11 items-center rounded-full bg-paper px-5 font-semibold text-ink md:left-8 md:top-8"
        >
          ← Back
        </Link>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[0.1em] right-2 text-[clamp(12rem,42vw,30rem)] font-bold leading-[0.8] text-paper/90 md:right-8"
        >
          {index + 1}
        </span>

        <CaseReveal className="relative mx-auto grid w-full max-w-[1200px] items-end gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          <div>
            <RevealItem>
              <p className="text-base font-semibold uppercase tracking-wider text-ink/80">0{index + 1}</p>
            </RevealItem>
            <RevealItem>
              <h1 className="mt-2 font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] text-ink">{project.title}</h1>
            </RevealItem>
            <RevealItem>
              <p className="mt-4 max-w-xl text-lg text-ink/80">{project.description}</p>
            </RevealItem>
          </div>
          <RevealItem className="mx-auto w-[min(50%,240px)]">
            <CardIcon kind={project.icon} />
          </RevealItem>
        </CaseReveal>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-20 md:px-8 md:py-28">
        <Body slug={project.slug} />
      </section>

      <Link
        href={`/projects/${next.slug}`}
        className="group block px-4 py-16 text-center md:px-8 md:py-24"
        style={{ backgroundColor: next.color }}
      >
        <span className="text-base font-semibold uppercase tracking-wider text-ink/80">Next</span>
        <span className="mt-2 block font-display text-[clamp(2.5rem,8vw,6rem)] leading-none text-ink transition-transform duration-300 group-hover:scale-105">
          {next.title} →
        </span>
      </Link>
    </main>
  );
}
