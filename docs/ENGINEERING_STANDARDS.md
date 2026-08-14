# Hunter Platform Engineering Standards

## Princípios

- Evoluir apenas sobre `C:\hunter-platform-clean`.
- Preservar o Premium V6 e evitar reescritas sem necessidade.
- Cada mudança deve passar por format, lint, typecheck, testes e build.
- Regra de negócio fica em services; acesso a dados fica em repositories.
- Controllers devem ser finos e trabalhar com DTOs validados.
- Segredos nunca devem ser versionados.

## Nomenclatura

- Arquivos: kebab-case.
- Classes e componentes: PascalCase.
- Funções e variáveis: camelCase.
- Constantes globais: UPPER_SNAKE_CASE.
- DTOs: `<ação>-<entidade>.dto.ts`.

## Frontend

- Pages orquestram; componentes apresentam; `lib/` integra serviços externos.
- Evitar dados mockados em páginas de produção.
- Componentes interativos devem possuir nome acessível e estados de foco.
- Tokens visuais devem substituir cores repetidas em novas implementações.

## Backend

- Validar configuração na inicialização.
- Definir CORS por ambiente.
- Proteger rotas privadas com guard JWT e autorização por papel quando necessário.
- Não expor entidades Prisma diretamente como contrato público de API.

## Definition of Done

1. Critérios de aceite atendidos.
2. `pnpm check` aprovado.
3. Migração de banco revisada quando aplicável.
4. `.env.example` atualizado.
5. Documentação da API atualizada.
6. Sem regressão visual no Premium V6.
