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

**Swap body font** — change the `Inter` import in `layout.tsx` and keep `--font-inter` (or rename both the variable and `tokens.css` stacks together).

**Type roles** — use `text-display-xl`, `text-display`, `text-title`, `text-body-lg` instead of one-off clamps where possible.

**Radius** — prefer `rounded-xl` / `rounded-2xl` / `rounded-3xl` (wired to tokens) over magic `rounded-[1.7rem]`.

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

Case study data lives in [`src/data/portfolio.ts`](src/data/portfolio.ts). Images for a project titled `Primer` resolve from `public/project/primer{1..10}.webp` via [`getProjectImages`](src/app/actions/getProjectImages.ts).
