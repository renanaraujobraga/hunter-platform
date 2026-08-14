# Dashboard Journey — Release 7.3

## Entrega

A Home Premium V6 passa a consumir `GET /api/dashboard` para todos os seus blocos:

- briefing;
- quatro métricas;
- feed de inteligência;
- meta anual;
- viagens monitoradas.

## Contrato

`GET /api/dashboard` retorna `DashboardResponse` definido em:

- Backend: `apps/flight-api/src/modules/dashboard/dashboard.types.ts`
- Frontend: `apps/flight-web/lib/dashboard-api.ts`

## Banco

Não há alteração de schema, migration ou seed nesta release. O endpoint usa os modelos existentes:

- User
- Hunter
- Alert
- PriceRecord

## Aplicação manual

Copie as pastas `apps` e `docs` deste patch para a raiz de `C:\hunter-platform-clean`, aceitando substituir somente os arquivos de mesmo nome.

## Validação

```powershell
cd C:\hunter-platform-clean
pnpm --filter @hunter/flight-api build
pnpm --filter @hunter/flight-web build
pnpm dev
```

URLs:

- `http://localhost:3333/api/dashboard`
- `http://localhost:3000`
