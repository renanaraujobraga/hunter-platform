# Hunter Backend MVP Complete

## Objetivo

Esta entrega fecha o backend funcional do MVP mantendo o Premium V6 intacto.

## Incluído

- Auth: register, login e me
- JWT
- DEMO_MODE para compatibilidade com o frontend V6 atual
- isolamento de Hunters e Alerts por usuário quando autenticado
- CRUD completo de Hunters
- ativar/pausar/arquivar Hunter
- histórico de preços
- execução manual de Hunter
- execução automática por scheduler
- Flight Provider abstrato
- Mock Flight Provider funcional para o MVP local
- Score Engine
- Recommendation Engine
- geração automática e deduplicação de Alerts
- Dashboard por usuário
- Alerts read/read-all
- Health + database check
- Swagger
- seed com 3 Hunters
- testes unitários reais do Score Engine

## Provider de tarifas

O MVP usa `MockFlightProvider`, para que a plataforma funcione end-to-end sem credenciais externas.

A troca por Amadeus, Duffel ou outro provedor é feita implementando `FlightProvider` e alterando o binding em `MonitoringModule`.

## Compatibilidade com Premium V6

`DEMO_MODE=true` permite que o Dashboard V6 continue chamando `/api/dashboard` sem Bearer Token.

Quando a tela de login estiver ligada ao frontend:

```env
DEMO_MODE="false"
```

## Endpoints principais

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/hunters`
- `POST /api/hunters`
- `GET /api/hunters/:id`
- `PATCH /api/hunters/:id`
- `PATCH /api/hunters/:id/status`
- `DELETE /api/hunters/:id`
- `POST /api/hunters/:id/run`
- `GET /api/hunters/:id/history`
- `GET /api/alerts`
- `PATCH /api/alerts/:id/read`
- `PATCH /api/alerts/read-all`
- `POST /api/monitoring/run-all`
- `GET /api/health`
- Swagger: `/docs`

## Login demo

- Email: `renan@hunter.ai`
- Password: `Hunter@123`

## Instalação

1. Faça backup de `C:\hunter-platform-clean`.
2. Copie o conteúdo do patch sobre a raiz do projeto.
3. Preserve seu `.env` atual e adicione:
   - `DEMO_MODE="true"`
   - `HUNTER_SCHEDULER_ENABLED="true"`
   - `HUNTER_SCAN_INTERVAL_MINUTES="15"`
4. Rode:

```powershell
cd C:\hunter-platform-clean
pnpm install
pnpm --filter @hunter/flight-api db:generate
pnpm --filter @hunter/flight-api db:seed
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm dev
```

Não é necessário migration: esta entrega usa o schema existente.
