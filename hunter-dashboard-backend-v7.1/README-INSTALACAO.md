# Instalação do patch Dashboard 7.1

Este pacote deve ser aplicado sobre:

`C:\hunter-platform-clean`

Ele altera somente o módulo Dashboard do backend e adiciona uma especificação em `docs`.

## PowerShell

Pare o projeto com `Ctrl + C` e execute, a partir da pasta onde extraiu este patch:

```powershell
Copy-Item `
  ".\apps\flight-api\src\modules\dashboard\*" `
  "C:\hunter-platform-clean\apps\flight-api\src\modules\dashboard" `
  -Recurse -Force

Copy-Item `
  ".\docs\DASHBOARD_JOURNEY.md" `
  "C:\hunter-platform-clean\docs\DASHBOARD_JOURNEY.md" `
  -Force

cd C:\hunter-platform-clean
pnpm --filter @hunter/flight-api build
pnpm dev
```

Teste no navegador:

`http://localhost:3333/api/dashboard`

Não é necessário rodar migration, seed ou `pnpm install`.
