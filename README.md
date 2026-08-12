```
 ____  _____ ____ ___ ____ _   _   _____ _   _  ____ ___ _   _ _____ _____ ____
|  _ \| ____/ ___|_ _/ ___| \ | | | ____| \ | |/ ___|_ _| \ | | ____| ____|  _ \
| | | |  _| \___ \| | |  _|  \| | |  _| |  \| | |  _ | ||  \| |  _| |  _| | |_) |
| |_| | |___ ___) | | |_| | |\  | | |___| |\  | |_| || || |\  | |___| |___|  _ <
|____/|_____|____/___\____|_| \_| |_____|_| \_|\____|___|_| \_|_____|_____|_| \_\
 ____   ___  ____ _____ _____ ___  _     ___ ___
|  _ \ / _ \|  _ \_   _|  ___/ _ \| |   |_ _/ _ \
| |_) | | | | |_) || | | |_ | | | | |    | | | | |
|  __/| |_| |  _ < | | |  _|| |_| | |___ | | |_| |
|_|    \___/|_| \_\|_| |_|   \___/|_____|___\___/
 _  _____ _____
| |/ /_ _|_   _|
| ' / | |  | |
| . \ | |  | |
|_|\_\___| |_|
```

Next.js portfolio kit for product designers and design engineers. Demo copy is sample content from a Nudge-style filler identity (Bejaman, Chicago). Replace it with your own.

## What you get

- App Router site with project archive, case studies, journey, about, blog, and contact
- Brand tokens in CSS (lime on dark by default)
- Motion with Framer Motion
- 3D lanyard badge (React Three Fiber)
- **Marvin**, a gloomy on-site chatbot that answers from your portfolio data

Stack: Next.js, TypeScript, Tailwind CSS, Framer Motion, next-intl.

## Setup

```bash
git clone <this-repo>
cd Technical_Portfolio
npm install
cp .env.example .env
```

Open `.env` and add your own keys:

```
OPENAI_API_KEY=sk-...
PROJECT_CASE_STUDY_PASSCODE=preview
```

Then:

```bash
npm run dev
```

The public template does **not** ship a real API key. Do not commit `.env`.

## Where to put your work

| What | Where |
|------|--------|
| Name, bio, location, socials, email | `src/data/portfolio.ts` → `personal` |
| Projects and case studies | `src/data/portfolio.ts` → `projects` |
| Roles and education | `src/data/portfolio.ts` → `experiences`, `education` |
| FAQs Marvin can quote | `src/data/portfolio.ts` → `faqs` |
| UI chrome copy | `messages/en.json` |
| Site metadata | `src/app/layout.tsx` (reads `personal` already) |
| Project images | `public/project/` (replace the labeled SVG frames) |
| Avatar | `public/about/avatar.svg` |
| Resume PDF | `public/resume.pdf` (page already points here) |
| Lanyard badge texture | `public/lanyard/desain-kartu.png` |
| Case-study passcode | `.env` → `PROJECT_CASE_STUDY_PASSCODE` |
| Brand lime, type, radius | `src/styles/tokens.css` |

North Light is passcode-gated as an example (`requiresPasscode: true`). Set the same value in `.env` and in Vercel if you keep a locked case study.

Demo copy is sample content. Replace it before you treat this as your site.

## Marvin

Marvin reads `portfolioData` and stays in character. He will not write code or answer general knowledge.

Provider order:

1. **Ollama** locally, if `OLLAMA_BASE_URL` is reachable (default `http://127.0.0.1:11434`)
2. **OpenAI** when `OPENAI_API_KEY` is set (`gpt-4o-mini`, including images)
3. Optional **Groq** (`GROQ_API_KEY`) then **Gemini** (`GEMINI_API_KEY`)

On Vercel, Ollama is not running. Chat works when `OPENAI_API_KEY` is set in the project dashboard.

Check providers:

```
GET /api/chat
```

## Deploy on Vercel

1. Import the repo
2. Settings → Environment Variables → add `OPENAI_API_KEY` for Production and Preview
3. Add `PROJECT_CASE_STUDY_PASSCODE` if you use locked case studies
4. Redeploy after the env vars are saved

Committed `.env` files are not used on Vercel. The dashboard value is what Marvin reads via `process.env.OPENAI_API_KEY`.

Private deploys may commit `.env` so clones work without extra setup. This public template gitignores `.env` and ships `.env.example` only.

## Lanyard card

The 3D badge uses `public/lanyard/desain-kartu.png` as a texture (plus `card.glb` and `lanyard.webp`). Export a portrait card with your name and title, dark background, and drop it in that path. Low-power mode falls back to `personal.name` and `personal.title`.

## Design tokens

| What | Where |
|------|--------|
| Brand lime, fonts, type scale, radius | `src/styles/tokens.css` |
| Light/dark surfaces | `src/styles/globals.css` |
| Tailwind mapping | `tailwind.config.ts` |
| Font loaders | `src/app/layout.tsx` |

## Scripts

```bash
npm run dev
npm run build
npm start
```
