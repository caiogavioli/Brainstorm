# action-log-condominial

Plataforma web que substitui o **Action Log em Excel** da DF Síndicos: um sistema único para os ~40 condomínios sob gestão, preenchido pelas administradoras, revisado toda semana pela DF e acompanhado por sindicância e proprietários.

> **Status:** projeto fechado em spec (2026-10-07), sem código ainda. A spec completa está em [`docs/spec.md`](docs/spec.md). Histórico da decisão: repositório `caiogavioli/Brainstorm`, branch `claude/dreamy-noether-ib9gbu`.

## Problema

Hoje cada condomínio tem um Excel com 12 abas. O Action Log guarda uma coluna por reunião semanal (138 colunas no arquivo analisado), com observações repetidas, campos sem uso, células sobrescritas sem rastro, investimento que conta item "em cotação" como economia, Forecast sem orçado e sem alerta de saldo negativo, e nenhuma visão da carteira.

## Escopo da v1

- Cadastro dos condomínios, administradoras, clientes e usuários (por convite, com escopo por condomínio).
- **Action Log:** assuntos com linha do tempo de atualizações datadas, botão "Sem novidade", campo "aguardando quem", revisão semanal da DF por carteira, pauta semanal.
- **Investimentos:** teto aprovado × contratado × pago; saving só quando concluído.
- **Forecast:** orçado, realizado e projetado por fundo e mês, com alerta de saldo projetado negativo; Posição Financeira como visão calculada.
- Log de alterações em tudo que a administradora edita; exportação para Excel; migração por script das planilhas existentes; uso confortável no celular.

Fora da v1 (mapeado): Inadimplência, Documentos, Contratos, Auditoria.

## Stack

Next.js 15 (App Router) + React 19 + TypeScript · Prisma + PostgreSQL · Tailwind CSS v4 · Zod · sessão JWT em cookie httpOnly + bcrypt. Hospedagem a decidir no primeiro deploy (Vercel + Neon ou VPS com Docker).

## Estrutura de pastas

```
docs/            spec e decisões
prisma/          schema e migrações
scripts/migracao/  importação das planilhas Excel (rodada por condomínio)
src/app/         rotas (App Router) e Server Actions
src/components/  componentes de interface
src/lib/         acesso (escopo por condomínio), sessão, regras de negócio
tests/           testes, com destaque para isolamento entre condomínios
```

## Dados sensíveis

Planilhas, CSVs e qualquer dado real de condomínio **não entram neste repositório** (o `.gitignore` bloqueia `*.xlsx`, `*.csv` e `dados/`). Fotos e anexos dos usuários ficam fora do controle de versão.
