# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server on localhost:3000
npm run build    # production build
npm run start    # start production server (after build)
npm run lint     # run ESLint
```

TypeScript type-checking (not part of `lint`):

```bash
npx tsc --noEmit
```

## Stack

- **Next.js 16** with App Router — this is a newer release; APIs and conventions may differ from training data. Check `node_modules/next/dist/docs/` when uncertain.
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** — configured via PostCSS (`postcss.config.mjs`), no `tailwind.config.*` file; uses the `@tailwindcss/postcss` plugin.
- **ESLint 9** with `eslint-config-next`

## Project Structure

```
src/
  app/           # App Router — every folder is a route segment
    layout.tsx   # root layout (Geist fonts, html/body shell)
    page.tsx     # "/" route
    globals.css  # global styles + Tailwind @import
public/          # static assets served at "/"
```

All source imports use the `@/*` alias which maps to `src/*` (configured in `tsconfig.json` and `next.config.ts`).

## Conventions

- Place new routes as `src/app/<segment>/page.tsx`.
- Shared UI components belong in `src/components/`.
- Server Components are the default; add `"use client"` only when browser APIs or React state/effects are needed.
- Fonts are loaded via `next/font/google` in the root layout and exposed as CSS variables (`--font-geist-sans`, `--font-geist-mono`).
