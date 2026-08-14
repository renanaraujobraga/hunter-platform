# Dashboard Journey — Release 7.2

## Objetivo

Eliminar os mocks da página inicial sem alterar o layout Premium V6.

## Endpoint

`GET /api/dashboard`

## Blocos alimentados pelo backend

1. Briefing inteligente
2. Economia estimada
3. Hunters ativos
4. Tarifas analisadas nas últimas 24 horas
5. Alertas não lidos
6. Feed de inteligência
7. Meta anual
8. Viagens monitoradas

## Regras atuais do MVP

- Economia estimada: soma positiva de `previousPrice - currentPrice` dos Hunters exibidos.
- Hunter ativo: `status = ACTIVE`.
- Alerta crítico: alerta não lido.
- Tarifas analisadas: `PriceRecord` capturado nas últimas 24 horas.
- Meta anual padrão: R$ 5.000.
- Recomendação:
  - score >= 90: COMPRAR AGORA
  - score >= 70: AGUARDAR
  - score < 70: ACOMPANHAR
- Feed: prioriza os três alertas mais recentes e completa com insights derivados dos Hunters.

## Próximas evoluções

- Obter nome do usuário autenticado em vez do valor temporário `Renan`.
- Persistir a meta anual por usuário.
- Calcular variação de economia com histórico real.
- Separar alertas críticos por severidade, além de leitura.
- Adicionar cache quando o volume justificar.
