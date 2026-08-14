# Jornada Dashboard — Release 7.1

## Objetivo

Alimentar a tela inicial Premium V6 por meio de um único contrato de backend, sem alterar o layout aprovado.

## Endpoint

`GET /api/dashboard`

## Contrato

```json
{
  "briefing": {
    "greeting": "Boa tarde",
    "importantUpdates": 1,
    "headline": "FLN → FOR caiu R$ 160 em relação ao preço anterior.",
    "generatedAt": "2026-07-22T18:00:00.000Z"
  },
  "metrics": {
    "estimatedSavings": 2486,
    "activeHunters": 3,
    "pricesAnalyzed": 4218,
    "criticalAlerts": 1
  },
  "annualGoal": {
    "target": 5000,
    "saved": 2486,
    "progressPercentage": 49.7,
    "paceDifference": 614
  },
  "intelligenceFeed": [],
  "monitoredTrips": []
}
```

## Origem dos dados

- `metrics.estimatedSavings`: soma das diferenças positivas entre `previousPrice` e `currentPrice` dos Hunters ativos.
- `metrics.activeHunters`: quantidade total de Hunters com status `ACTIVE`.
- `metrics.pricesAnalyzed`: quantidade de registros em `PriceRecord`.
- `metrics.criticalAlerts`: alertas ainda não lidos.
- `annualGoal.target`: variável opcional `DASHBOARD_ANNUAL_GOAL`; padrão `5000`.
- `intelligenceFeed`: três alertas mais recentes, enriquecidos com a rota e a variação de preço do Hunter.
- `monitoredTrips`: seis Hunters ativos atualizados mais recentemente.

## Arquitetura

- `DashboardController`: expõe o endpoint.
- `DashboardService`: orquestra a resposta.
- `DashboardRepository`: concentra acesso ao Prisma.
- `MetricsProvider`: calcula os quatro cards.
- `AnnualGoalProvider`: calcula progresso e ritmo anual.
- `IntelligenceProvider`: transforma alertas em feed de inteligência.
- `MonitoredTripsProvider`: prepara os cards/lista de viagens monitoradas.
- `BriefingProvider`: gera saudação, quantidade de novidades e destaque principal.

## Compatibilidade

A release usa apenas modelos já presentes no backend atual: `Hunter`, `Alert` e `PriceRecord`. Não exige migration nem alteração no `schema.prisma`.

## Critérios de aceite

1. `GET /api/dashboard` retorna HTTP 200.
2. A resposta contém `briefing`, `metrics`, `annualGoal`, `intelligenceFeed` e `monitoredTrips`.
3. O backend compila sem novas dependências.
4. O endpoint funciona com banco vazio, retornando listas vazias e métricas zeradas.
5. O frontend V6 pode mapear todos os blocos principais da Home usando apenas este endpoint.

## Próximo passo

Criar o adapter no frontend V6 para substituir os dados estáticos da Home por `GET /api/dashboard`, preservando integralmente o layout.
