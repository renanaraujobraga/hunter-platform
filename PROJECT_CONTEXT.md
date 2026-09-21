# Flight Hunter AI — Project Context

> Living handoff document for humans and AI collaborators. Last updated: 2026-09-21.

## 1. Product vision

Flight Hunter AI is a flight-fare monitoring and decision-support product. The goal is not merely to list fares: it should continuously monitor routes, keep price history, score opportunities, explain why a fare is interesting, and tell the user whether to buy or wait.

Long-term direction: a "Google Flights with intelligence" tailored to the user's rules, history and preferences.

Core principles:
- Brazilian domestic flights first.
- Prices shown in BRL.
- Persistent price history and comparisons over time.
- Actionable score, recommendation and confidence.
- High-signal notifications rather than noisy alerts.
- Explain the reason behind a recommendation.

## 2. Product rules and original intent

The initial use case was monitoring flights departing from Florianópolis, especially routes such as Fortaleza and Rio de Janeiro, with flexible date windows.

Desired alerting model:
- User-facing score: 0–100.
- High-priority external notifications should be conservative; original product intent is to notify only at score >= 95 unless a user explicitly changes the threshold.
- Recommendation should communicate buy vs wait.
- Include savings versus recent/expected average when data supports it.
- Include confidence: high / medium / low (the current backend stores numeric confidence).
- Important opportunity labels:
  - 🟢 Boa oferta / Boa oportunidade
  - 🔥 Promoção
  - 🚨 Comprar imediatamente / Comprar agora
  - 💎 Oferta rara
- Detect/flag unusually strong promotions or possible fare errors when evidence supports it.
- Keep history for later comparison and insights.
- Telegram was selected as the first notification integration direction; WhatsApp was discussed but cost was a concern.
- Search/monitoring was originally envisioned multiple times per day (08:00, an intermediate period, and 20:00). The current implementation uses a configurable interval scheduler instead; see current-state notes below.

Important: distinguish **product intent** from **current implementation**. Do not silently change one to match the other. Raise discrepancies explicitly.

## 3. Current production state

As of 2026-09-21:
- Frontend is deployed on Vercel.
- Production frontend: https://hunter-platform-flight-web.vercel.app
- Backend is deployed on Render.
- Production API base used by the frontend: https://hunter-flight-api.onrender.com/api
- Database: PostgreSQL on Neon.
- Authentication works end-to-end.
- A real production user can create Hunters.
- Dashboard, Hunter list, API and database persistence have been validated end-to-end.
- A test Hunter FLN → SDU was created successfully; dashboard reflected 1 active Hunter and 1 analyzed fare.

Critical caveat: **the current flight provider is a mock provider**, not a live airfare source. Therefore displayed fares must not be treated as real market fares yet. Integrating and validating a real flight-data provider is a top product/engineering priority.

## 4. Repository and architecture

Repository: `renanaraujobraga/hunter-platform`

Monorepo:
- `apps/flight-web` — Next.js frontend.
- `apps/flight-api` — NestJS backend.
- `docs` — project/engineering documentation.
- root — pnpm workspace + Turborepo orchestration.

Current stack:
- Node.js 22 LTS target.
- pnpm 10.15.1.
- Turborepo 2.5.x.
- Frontend: Next.js 15.5.18, React 19, TypeScript, Tailwind.
- Backend: NestJS 11, Prisma 6, PostgreSQL, JWT/Passport, bcrypt.
- Hosting: Vercel (web), Render (API), Neon (PostgreSQL).

Backend modules currently include:
- auth
- hunters
- monitoring
- alerts
- dashboard
- health

Monitoring architecture has a `FlightProvider` abstraction. Current concrete implementation is `MockFlightProvider`, which is intentionally replaceable by a real provider.

## 5. Data model

Prisma entities:
- User: name, unique email, password hash, role.
- Hunter: route, date windows, optional max price, current/previous price, score, confidence, status, owner.
- PriceRecord: price, BRL by default, source, capture time, Hunter.
- Alert: title, message, severity, read state, Hunter.

Hunter statuses: ACTIVE, PAUSED, ARCHIVED.
Alert severities: INFO, GOOD_DEAL, PROMOTION, BUY_NOW, RARE.

Never store plaintext passwords. Never commit production secrets.

## 6. Current scoring implementation

`ScoreEngineService` currently starts at score 50 and adjusts based on:
- relation to user max price;
- change versus previous captured price;
- relation to recent history (up to 20 prices).

Current backend recommendation thresholds:
- >= 90: COMPRAR AGORA
- >= 75: BOA OPORTUNIDADE
- otherwise: ACOMPANHAR

Current severity thresholds:
- >= 97: RARE
- >= 90: BUY_NOW
- >= 82: PROMOTION
- >= 75: GOOD_DEAL
- otherwise: INFO

Current backend creates in-app alerts at score >= 75 and deduplicates unread alerts of the same severity for 6 hours.

Product-intent discrepancy: external/high-signal notification behavior was defined around score >= 95. Preserve this distinction when adding Telegram or other outbound notifications; do not assume the in-app alert threshold should equal the outbound notification threshold.

## 7. Authentication and frontend behavior

Authentication is JWT-based. The browser stores the token under `hunter_token`.

A production issue was fixed in September 2026: the dashboard had been fetched during server rendering, where `localStorage` is unavailable, causing API 401 and a server-side Vercel exception. Dashboard loading was moved client-side so the browser can read the token. When working on auth, do not reintroduce authenticated API calls during SSR unless authentication is redesigned around server-readable cookies/session state.

## 8. Environment configuration

Backend variables documented by the repository:
- NODE_ENV
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN
- PORT
- CORS_ORIGINS
- DEMO_MODE
- HUNTER_SCHEDULER_ENABLED
- HUNTER_SCAN_INTERVAL_MINUTES

Frontend production variable:
- NEXT_PUBLIC_API_URL=https://hunter-flight-api.onrender.com/api

Do not place actual DATABASE_URL, JWT_SECRET, tokens, passwords or provider API keys in documentation, commits, logs or PR descriptions.

## 9. Deployment model

Frontend:
- Vercel project rooted at `apps/flight-web`.
- Framework: Next.js.
- Install: `pnpm install`.
- Build: `pnpm build`.
- Output directory should remain Next.js/Vercel automatic; do not enter literal text such as "Next.js default".
- Production deploys follow `main`.

Backend:
- Render service for `apps/flight-api`.
- PostgreSQL connection is Neon.
- Prisma migrations must be applied for schema changes.
- CORS must allow the production Vercel origin.

## 10. CI and engineering workflow

Repository quality gates cover dependency install, Prisma generation, typecheck, lint, tests and build.

Preferred collaboration workflow:
1. Read this document and `AGENTS.md`.
2. Inspect relevant code/docs before proposing changes.
3. Create a focused branch.
4. Make the smallest coherent change.
5. Run the relevant checks; ideally the full CI-equivalent suite.
6. Open a PR explaining behavior change, risks, migrations/env changes and validation.
7. Merge only after CI succeeds.
8. Update this document when architecture, production state, product rules or major decisions change.

Do not push feature work directly to `main` unless explicitly requested.

## 11. Important history / decisions

Recent milestones:
- Backend migrated from SQLite to PostgreSQL/Neon.
- CI quality gates were established.
- Frontend was deployed to Vercel.
- Next.js was upgraded from 15.5.2 to 15.5.18 after Vercel blocked deployment due to a vulnerable version.
- Dashboard production 401 was fixed by moving authenticated dashboard fetching from SSR to client-side.
- End-to-end production flow was validated: web → API → PostgreSQL → web.

The repository contains older backup/legacy directories. Treat `apps/flight-web` and `apps/flight-api` as the active applications unless a task explicitly says otherwise.

## 12. Near-term priorities

Recommended order:
1. Replace/mock-isolate the airfare provider with a real, legally/technically suitable flight-data source.
2. Validate that returned fare semantics are correct (round trip vs one way, baggage, taxes, passenger count, cabin, date/time).
3. Harden scoring against real price history and define score calibration using observed data.
4. Reconcile in-app alert threshold (currently 75) with outbound notification policy (original intent >=95).
5. Validate scheduler behavior in production and prevent duplicate/concurrent scans.
6. Add Telegram outbound notifications after real fare data is trustworthy.
7. Improve price-history/insights UI and recommendation explanations.
8. Add observability for provider failures, scheduler runs, API errors and alert delivery.
9. Add stronger automated tests for frontend auth and end-to-end monitoring flows.
10. Security/production hardening: CORS, rate limiting, auth/session strategy, secret rotation procedures, backups/migrations.

## 13. Definition of a trustworthy fare

Before calling a fare "real" or recommending purchase, a collaborator should be able to identify:
- provider/source;
- route and airports;
- outbound/return dates;
- passenger count;
- one-way vs round trip;
- total price and currency;
- taxes/fees inclusion;
- baggage/cabin assumptions where available;
- capture timestamp;
- deeplink/booking path when provider permits.

Until a real provider is integrated, current mock quotes are development/test data.

## 14. Collaboration protocol

When another AI joins:
- Start by reading `AGENTS.md`, this file, `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, and relevant source files.
- State assumptions explicitly.
- Separate "implemented today" from "desired product behavior".
- Never invent provider capabilities, prices, production configuration or secrets.
- If documentation conflicts with code, code describes current behavior; flag the discrepancy and propose a documentation/implementation reconciliation.
- Preserve Portuguese product language where it is user-facing; code/technical docs may use English.
- Prefer incremental, reviewable PRs over broad rewrites.
- Record major architectural/product decisions in docs.

## 15. Owner/product direction

Product decisions ultimately belong to the project owner. AI collaborators should surface trade-offs and evidence, not silently redefine the product. The product should prioritize trustworthy data, useful decisions and low-noise alerts over feature count.
