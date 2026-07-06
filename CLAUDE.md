# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # Next.js frontend on http://localhost:3000
npm run build      # Production build (also the de-facto typecheck)
npm run lint       # ESLint

# Python agents backend (FastAPI) on http://localhost:8000 — run from repo root
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

There is no test suite. The backend requires a `.env` at the repo root (loaded via `python-dotenv`) with `OPENAI_API_KEY`, and for Gmail/Places features: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GOOGLE_PLACES_API_KEY`.

## Architecture

Two independent processes:

1. **Frontend** — Next.js 16 App Router (React 19, Tailwind 4, TypeScript, `@/*` → `src/*`). Client state lives in Zustand stores.
2. **Backend** — FastAPI app in `backend/` ("Tripio Agents API") that wraps the OpenAI Agents SDK. The frontend calls it directly from the browser via `NEXT_PUBLIC_AGENTS_API_URL` (default `http://localhost:8000`); CORS allows only `localhost:3000`. There are no Next.js API routes — all server logic is in the Python backend.

### Next.js 16 gotchas (differs from older training data)

- `src/proxy.ts` is the **middleware** file — Next 16 renamed `middleware.ts` to `proxy.ts` (exports a `proxy` function). Do not create a `middleware.ts`.
- `params` in layouts/pages is a `Promise` and must be awaited.
- Consult `node_modules/next/dist/docs/` before using any Next API you're unsure about.

### i18n (next-intl)

All pages live under `src/app/[locale]/` — there is no root `layout.tsx`; `src/app/[locale]/layout.tsx` renders `<html>` and sets `dir="rtl"` for Hebrew. Locales are `en` and `he` (`src/i18n/routing.ts`); messages are in `messages/{en,he}.json`. `next.config.ts` wires the next-intl plugin to `src/i18n/request.ts`, and `src/proxy.ts` runs the next-intl locale middleware. New user-facing strings must be added to both message files and accessed via `useTranslations`.

### Frontend layering

Data flows: page (`src/app/[locale]/**`) → feature component (`src/features/<domain>/components/`) → Zustand store (`src/store/*.store.ts`) → service (`src/services/*.service.ts`) → FastAPI backend.

- `src/services/` — thin typed `fetch` wrappers over backend endpoints; no state.
- `src/store/` — Zustand stores own async orchestration and state (`diagnosis`, `trip`, `tripIntent`).
- `src/types/` — shared TS types mirroring the backend Pydantic models in `backend/models/`. Keep the two in sync when changing an API shape.
- `src/features/<domain>/` — domain UI (diagnosis, planning, trips); components are `<Name>/index.tsx` folders. `src/components/` holds cross-domain shells (`AppShell`, `TripShell`).

### Backend layering

`backend/api/` (FastAPI routers) → `backend/services/` (orchestration) → `backend/dal/` (integrations: agents, Gmail client, Google OAuth, Places client, in-memory token store).

Each AI agent in `backend/dal/agents/` subclasses `BaseAgent` (`backend/dal/base_agent.py`): declare persona/tools/`output_type` in `build_agent()`, get a typed `run()` via the OpenAI Agents SDK. Agents cover diagnosis, planning, itinerary, hotels, restaurants, attractions, and Gmail trip lookup. `backend/dal/question_bank.py` provides fallback diagnosis questions when `OPENAI_API_KEY` is unset (`is_configured()`).

### Product flow

The core journey: travel-style **diagnosis** quiz (agent-generated questions → `TravelDiagnosisProfile`) → new trip intent (from scratch or imported from Gmail bookings) → agentic **planning** (`/trips/plan`) → trip workspace (`/trips/[tripId]`) with itinerary and place management backed by Google Places.
