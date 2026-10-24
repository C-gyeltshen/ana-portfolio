# Playful Portfolio

A bouncy, tactile UI/UX portfolio built with Next.js (App Router), React, TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger + SplitText), Motion (Framer Motion) and Lenis.

## Run it locally

Requires **Node.js 20.9+** (Node 22 recommended).

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx                 Fonts, global CSS, <Providers>
  globals.css                Tailwind v4 theme tokens (colours, fonts), paper grain, cursor CSS
  page.tsx                   Home: Hero → About → Content heading → Projects → Footer
  projects/[slug]/page.tsx   Placeholder case study (static pages for every project)
components/
  providers/
    Providers.tsx            IntroProvider + MotionConfig(reducedMotion="user") + Lenis + Loader + Cursor
    IntroProvider.tsx        `ready` flag: loader finished → hero may animate
    SmoothScroll.tsx         Lenis driven by GSAP's ticker, synced with ScrollTrigger
  ui/
    Loader.tsx               0 → 100% counter, then slides away and triggers the hero
    Cursor.tsx               Dot cursor that grows into a labelled circle on [data-cursor]
    Magnetic.tsx             Spring "magnetic" wrapper for buttons/links
    Footer.tsx
  hero/Hero.tsx              Dropping letters, masked character reveal, '25 counter, parallax
  about/
    About.tsx                SplitText heading/paragraph, staggered reveals, icon pop-in
    Lanyard.tsx              Draggable ID card with spring pendulum physics
    SoftwareIcons.tsx        Tool tiles with lift + brand-colour glow on hover
  content/ContentHeading.tsx Scroll-scrubbed outline → solid fill, scattered numbers settle
  projects/
    Projects.tsx             Grid/accordion, number slide-up, full-screen colour wipe → route
    ProjectCard.tsx          Layout accordion, 3D mockup tilt, card markup
    Mockup.tsx               CSS-only phone and laptop mockups
  case/CaseReveal.tsx        Staggered entrance on case-study pages
lib/
  gsap.ts                    Registers GSAP plugins once + reduced-motion media conditions
  hooks.ts                   useMediaQuery / usePrefersReducedMotion
  projects.ts                Project data (title, description, colours, mockup type)
public/images/
  character.png              Hero illustration (placeholder: replace with yours)
  photo.jpg                  ID-card photo (placeholder: replace with yours)
```

## Make it yours

- **Name and copy:** search for `[Your Name]` and other `[bracketed]` placeholders.
- **Projects:** edit `lib/projects.ts`. The slug becomes `/projects/<slug>`.
- **Images:** replace `public/images/character.png` (transparent PNG works best) and `public/images/photo.jpg` (3:4 portrait).
- **Real screenshots in the cards:** replace the `<Screen />` content in `components/projects/Mockup.tsx` with `<Image fill className="object-cover" />`.
- **Software icons:** the tiles show initials plus a brand-colour dot. Swap in the official icons from each brand's press kit inside `SoftwareIcons.tsx`.
- **Colours and fonts:** `@theme` block in `app/globals.css`.

## Animation and performance notes

- Animations only move `transform` and `opacity`, so they stay smooth at 60fps. The lanyard strap stretches with `scaleY`, the "CONTENT" fill is a counter-translated mask, and the card wipe is a scaled fixed overlay.
- **Reduced motion:** every GSAP section uses `gsap.matchMedia()` and switches to simple fades. Framer Motion respects the OS setting via `MotionConfig reducedMotion="user"`. Lenis falls back to native wheel scrolling. The lanyard can't be dragged and hangs still.
- **Touch devices:** no custom cursor, no parallax, no 3D tilt, and the project cards stack instead of using the accordion. Tapping a letter still wobbles it.
- GSAP's SplitText is included in the free `gsap` npm package (3.13+).
