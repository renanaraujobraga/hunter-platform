# Hunter AI Web v0.7.0 — Frontend integrado

Esta entrega preserva o visual Premium V6 e troca os dados mockados por chamadas à API `http://localhost:3333/api` (ou `NEXT_PUBLIC_API_URL`).

## Funcionalidades
- autenticação: login, registro, sessão via JWT em localStorage e logout
- dashboard real (endpoint já integrado)
- listagem de Hunters real
- criação de Hunter
- edição de nome e teto de preço
- exclusão
- pausar / ativar
- executar busca manual
- histórico de preços real
- alertas reais
- marcar alerta individual como lido
- marcar todos como lidos
- relatórios derivados dos dados reais
- contadores reais no menu lateral

## Aplicação
Execute `APLICAR-FRONTEND-MVP.ps1` a partir da pasta extraída. Ele substitui somente `apps/flight-web`, preservando o restante do monorepo.

Depois, em `C:\hunter-platform-clean`:

    pnpm install
    pnpm typecheck
    pnpm lint
    pnpm build
    pnpm dev

## Observação
O backend deve estar rodando na porta 3333. Para outra URL, defina `NEXT_PUBLIC_API_URL`.
