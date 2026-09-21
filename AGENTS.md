# AGENTS.md — Flight Hunter AI Collaboration Guide

This repository is developed by a human owner with AI collaborators. This file is the mandatory starting point for any coding agent.

## Read first

Before changing code:
1. Read `PROJECT_CONTEXT.md`.
2. Read the relevant files under `docs/`.
3. Inspect the actual implementation you are changing.
4. Check recent PRs/commits when behavior is unclear.

## Active applications

Use these as the canonical active apps:
- `apps/flight-web` — Next.js frontend.
- `apps/flight-api` — NestJS/Prisma backend.

Do not implement new work in legacy/backup directories unless explicitly instructed.

## Non-negotiable rules

- Never commit secrets, passwords, production database URLs, JWT secrets, access tokens or provider API keys.
- Never claim mock airfare data is real.
- Do not change scoring thresholds, notification policy or core product behavior silently.
- Do not bypass authentication or weaken security merely to make a deployment pass.
- Do not push broad unrelated refactors with a feature/fix.
- Database schema changes require a Prisma migration and deployment notes.
- New environment variables must be documented without secret values.
- Preserve the `FlightProvider` abstraction when integrating a real airfare source.
- Authenticated browser data currently relies on `hunter_token` in localStorage; do not reintroduce SSR calls that require that token unless auth architecture is intentionally redesigned.

## Product guardrails

- Domestic Brazil first.
- Currency shown to users: BRL.
- Maintain persistent price history.
- Explain scores/recommendations.
- Outbound notifications are intended to be high-signal; original target threshold is score >=95 unless the owner changes it.
- Current in-app alert creation starts at score >=75. This is a known distinction, not permission to redefine outbound behavior.

## Development workflow

Use branch → PR → CI → merge.

Before requesting merge, run the relevant checks. From repository root, the preferred comprehensive command is:

```bash
pnpm check
```

At minimum, ensure install/Prisma generation/typecheck/lint/tests/build are covered by CI.

PR descriptions should include:
- what changed;
- why;
- product behavior affected;
- tests/checks run;
- DB migration or environment-variable impact;
- deployment/rollback notes when relevant.

## Documentation duty

Update `PROJECT_CONTEXT.md` whenever a change materially affects:
- architecture;
- deployment topology;
- product rules;
- scoring/alert behavior;
- production status;
- provider/source of flight data;
- authentication strategy;
- major roadmap priorities.

Record durable technical decisions in the appropriate `docs/` file as well.

## Current critical fact

The active backend currently uses a mock flight provider. Fare values are not yet trustworthy real-world airfare data. Real provider integration and validation is a top priority.

## Working with other AI agents

Assume another agent may continue your work later. Leave the repository in a state that is understandable without access to your private chat history. Prefer code comments only where they add value; put cross-cutting context in docs.

When uncertain, ask or open a PR with the uncertainty clearly documented rather than guessing.
