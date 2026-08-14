# Hunter Platform

Version: 1.0
Status: In Development
Owner: Renan Braga

# Vision

Hunter Platform is an AI-powered opportunity monitoring platform.

The first product is Flight Hunter.

Future products:
- Flight Hunter
- Hotel Hunter
- Car Hunter
- House Hunter
- Job Hunter
- Product Hunter
- Credit Card Hunter
- Insurance Hunter

## Principles

- Intelligence first
- Automation
- Simplicity
- Scalability

# Technology Stack

Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- React Query

Backend
- NestJS
- Prisma
- PostgreSQL

Future
- Redis
- BullMQ
- OpenAI
- Telegram

# Repository Structure

apps/
    flight-web/
    flight-api/

packages/
    shared-types/
    sdk/

docs/
infra/
docker/

# Golden Rule

There is only ONE project:

C:\hunter-platform-clean

Never create parallel versions.

# Architecture

Controller
  ↓
Service
  ↓
Assembler
  ↓
Providers
  ↓
Repositories
  ↓
Prisma

Repositories are the only layer allowed to access Prisma.

Frontend never knows the database.

It consumes DTOs only.

# Dashboard

GET /api/dashboard

Returns:
- Briefing
- Summary Cards
- Intelligence Feed
- Annual Goal
- Hunters
- Trips

# Hunter

Each Hunter contains:
- Origin
- Destination
- Dates
- Flexibility
- Target Price
- Current Price
- Score
- Alerts
- History

# AI

AI never answers only "Buy".

It explains every recommendation using market context and historical data.

# Development Rules

- No any
- SOLID
- Clean Architecture
- Incremental Pull Requests
- No project replacement
- English code
- Typed DTOs
- Small providers
