<div align="center">

# 🧠 Hunter Platform

### Autonomous AI Workers that make decisions for people.

*"Stop searching. Start delegating."*

---

The platform behind every Hunter AI product.

</div>

---

# Vision

Hunter Platform is the engineering foundation that powers a new generation of autonomous AI workers ("Hunters").

Instead of helping users search for information, Hunters continuously work on their behalf, monitor changes, learn user preferences, and recommend the best decisions.

Our first Hunter is **Flight Hunter**.

Many others will follow.

---

# Mission

People shouldn't waste hours comparing prices, checking websites or monitoring opportunities.

Hunters do that work automatically.

Our mission is simple:

> **Delegate repetitive decision-making to AI.**

---

# Product Philosophy

We are **not building another search engine.**

We are building autonomous digital workers.

A Hunter:

- Monitors continuously
- Learns user behavior
- Explains every recommendation
- Improves over time
- Works while the user sleeps

---

# Hunter Ecosystem

The Hunter Platform is designed to support multiple AI workers.

Current roadmap:

- ✈️ Flight Hunter
- 🏨 Hotel Hunter
- 🚗 Car Hunter
- 🏠 Real Estate Hunter
- 📈 Investment Hunter
- 🛡 Insurance Hunter
- 🛍 Shopping Hunter

Every Hunter shares the same engineering platform.

---

# Current Product

## Flight Hunter

Flight Hunter continuously monitors airline ticket prices and recommends the best moment to buy.

Instead of manually searching every day, users simply delegate the task.

The Hunter works 24/7.

---

# MVP

Current MVP scope:

- User authentication
- Hunter creation
- Automatic monitoring
- Historical price tracking
- Timeline
- Recommendation Engine
- Confidence Score
- Telegram notifications

Everything else is intentionally postponed.

---

# Engineering Principles

Hunter Platform follows a few non-negotiable principles.

## Documentation First

If it's not documented,
it doesn't exist.

---

## Architecture Before Code

Good software is designed before it's implemented.

---

## Humans First

Code is written for humans.

AI is a productivity tool,
not the target audience.

---

## Small Iterations

Every Sprint produces working software.

No big-bang releases.

---

## Clean Architecture

Business rules are independent from frameworks.

Technology may change.

Business rules shouldn't.

---

# Platform Architecture

```
Hunter Platform

                Frontend
                  │
        ┌─────────┴─────────┐
        │                   │
     Flight Web         Admin Portal

                  │

             REST API

                  │

────────────────────────────────────

Identity

Hunter Core

Monitoring Engine

Recommendation Engine

Memory Engine

Notification Engine

Billing

Analytics

────────────────────────────────────

PostgreSQL

Prisma ORM

────────────────────────────────────

External Providers

Flight APIs

Telegram

Email

```

---

# Repository Structure

```
hunter-platform/

apps/
packages/
services/
docs/
docker/
prisma/
scripts/
.github/
```

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- TailwindCSS
- shadcn/ui

---

## Backend

- NestJS
- TypeScript

---

## Database

- PostgreSQL

- Prisma ORM

---

## Infrastructure

- Docker

- Turborepo

- PNPM

---

## Authentication

- Supabase Auth

---

## Deployment

Frontend

- Vercel

Backend

- Railway

---

# Engineering Standards

Every change must follow our engineering standards.

- Small Pull Requests
- Conventional Commits
- ADR-driven decisions
- Automated formatting
- Automated linting
- Automated testing
- Clear documentation

---

# Documentation

The entire company documentation lives inside:

```
docs/
```

Including:

- Vision
- Constitution
- PRD
- ADRs
- Architecture
- Engineering Standards
- Research
- Roadmap

---

# Development Workflow

```
Issue

↓

Branch

↓

Development

↓

Pull Request

↓

Review

↓

Merge

↓

Deploy
```

---

# Roadmap

## Current

✅ Engineering Foundation

---

## Next

- Authentication
- Hunter CRUD
- Monitoring Engine
- Recommendation Engine
- Notification Engine
- Billing
- Internal Beta

---

## Future

- Conversational Hunters
- Hunter Memory
- Hotel Hunter
- Investment Hunter
- AI Personalization

---

# Core Philosophy

> We don't build software.

We build autonomous workers.

---

# License

Private Repository

Copyright © Hunter AI

All rights reserved.
