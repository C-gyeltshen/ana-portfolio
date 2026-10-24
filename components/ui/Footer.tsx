import Magnetic from "./Magnetic";

export default function Footer() {
  return (
    <footer className="bg-ink px-4 py-12 text-paper md:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-display text-2xl">Choki Zangmo</p>
          <p className="mt-1 text-base text-paper/70">Restaurant Manager · Open to new roles</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <a
              href="mailto:Choe@gmail.com"
              className="inline-flex min-h-12 items-center rounded-full bg-beige px-6 font-semibold text-ink"
            >
              Say hello
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#top"
              className="inline-flex min-h-12 items-center rounded-full border-2 border-paper/30 px-6 font-semibold"
            >
              Back to top ↑
            </a>
          </Magnetic>
        </div>
        <p className="text-sm text-paper/60">© 2026 Choki Zangmo</p>
      </div>
    </footer>
  );
}
