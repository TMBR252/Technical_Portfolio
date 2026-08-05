# Tyler Bryan — Design Engineer Portfolio

Next.js portfolio for product / design engineering work.

## Edit the design system

Almost all visual identity lives in tokens — change these first, not random components.

| What | Where |
|------|--------|
| Brand lime, fonts, type scale, radius, brand shadows | [`src/styles/tokens.css`](src/styles/tokens.css) |
| Light/dark surface colors (bg, muted, border) | [`src/styles/globals.css`](src/styles/globals.css) (`:root` / `.dark`) |
| Tailwind mapping (`text-brand`, `font-display`, …) | [`tailwind.config.ts`](tailwind.config.ts) |
| Font files loaded | [`src/app/layout.tsx`](src/app/layout.tsx) (`next/font`) |
| Breakpoints | [`src/lib/breakpoints.ts`](src/lib/breakpoints.ts) |
| JS helpers (canvas / Three) | [`src/lib/design-tokens.ts`](src/lib/design-tokens.ts) |

### Common edits

**Rebrand accent color** — update `--brand`, `--brand-rgb`, and optionally `--brand-deep*` in `tokens.css`.

**Swap body font** — change the `Inter` (or other) loader in `layout.tsx`; keep the same CSS variable name (`--font-inter`, etc.) that Tailwind references in `tailwind.config.ts`.

**Type roles** — opt-in: `text-display-xl`, `text-display`, `text-title`, `text-body-lg` (does not change default `text-sm` / `text-xl`).

**Radius** — `rounded-lg` uses `--radius`. Extra token sizes: `rounded-token-xl` / `rounded-token-2xl` / `rounded-token-3xl`.

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
npm start
```

## Project case studies

Case study data lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).

- Prefer optional `caseStudy: CaseStudySection[]` (problem, approach, architecture, exploration, solution, outcome, validation, reflection, …). Only include sections that apply; TOC and page follow array order.
- Legacy `features` / `challengesAndSolutions` / gallery still render when `caseStudy` is absent.
- Hero/media use chrome-free [`ProjectMedia`](src/components/projects/ProjectMedia.tsx) (no browser traffic lights or URL bar).
- Images for a project titled `Primer` resolve from `public/project/primer{1..10}.webp` via [`getProjectImages`](src/app/actions/getProjectImages.ts).
