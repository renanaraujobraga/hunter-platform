# AI Handoff Checklist

Use this checklist when onboarding a new AI collaborator.

## Prompt to give the collaborator

> You are joining the Flight Hunter AI project. Read AGENTS.md and PROJECT_CONTEXT.md first, then inspect docs/PROJECT.md, docs/ARCHITECTURE.md and the relevant source code. Treat apps/flight-web and apps/flight-api as the active applications. Before changing anything, summarize your understanding of the current state, the requested task, assumptions, risks and files likely to change. Work through a branch and PR, run CI-quality checks, never expose secrets, and update PROJECT_CONTEXT.md if your work changes architecture, product rules, deployment, auth, scoring/alerts or the flight-data provider.

## Access the collaborator may need

Depending on task:
- GitHub repository access.
- Vercel project access for frontend deployment/logs.
- Render service access for backend deployment/logs.
- Neon access for database operations.
- Flight-provider credentials once a real provider is selected.
- Telegram bot credentials once outbound notifications are implemented.

Grant least privilege. Do not paste credentials into prompts or repository files.

## Before the collaborator codes

Confirm it understands:
- current provider is mock;
- production web/API/database topology;
- score and alert thresholds;
- BRL/domestic-flight product focus;
- active app directories;
- branch/PR/CI workflow;
- secrets policy.

## Before merging its work

Check:
- scope matches task;
- no secrets or credentials were committed;
- no legacy directory was modified accidentally;
- typecheck/lint/tests/build pass;
- migrations/env changes are documented;
- product behavior changes are explicit;
- PROJECT_CONTEXT.md was updated when required.
