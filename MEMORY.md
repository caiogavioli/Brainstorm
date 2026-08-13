# MEMORY.md

Estado vivo do brainstorming. Ler no início de cada sessão, atualizar ao fim de cada rodada ou decisão.

**Última atualização:** 2026-08-13

---

## Situação atual

Primeiro projeto fechado: catálogo de produtos de impressão 3D (P-001).
Spec revisada para v2 (site com login + catálogo público, marca CMG3D) antes
de qualquer implementação começar — v1 (PDF via script local) foi
descartada. Repositório e esqueleto atualizados para a v2. Implementação do
scaffold inicial (Next.js + Supabase, catálogo público + área admin) feita
no repo `catalogo-produtos-3d`, branch `claude/setup-inicial` — ver seção
"Em aberto" para o que falta antes de ir ao ar.

## Problemas

| ID | Título | Fase | Desfecho |
|---|---|---|---|
| P-001 | Catálogo de produtos de impressão 3D (CMG3D) | fechado (v2) | virou repo `catalogo-produtos-3d` |

Fases: `apresentado` → `rodada 1` → `rodada 2` → `fechado` / `descartado` / `virou script`

## Projetos fechados

| Projeto | Origem | Repositório | Data |
|---|---|---|---|
| CMG3D — catálogo de produtos de impressão 3D (site) | P-001 | [caiogavioli/catalogo-produtos-3d](https://github.com/caiogavioli/catalogo-produtos-3d) | 2026-08-13 (v2) |

## Decisões sobre o processo

| Data | Decisão | Contexto |
|---|---|---|
| 2026-08-09 | Repositório dedicado só é criado no **passo 5**, mediante pedido explícito do usuário. Fim da Rodada 2 não dispara criação. | O usuário perguntou em que momento o repo nasce; alternativa considerada era criar já no fim da Rodada 1, descartada por gerar repositório vazio com nome provisório. |
| 2026-08-09 | Relação problema → repositório não é 1-para-1. O recorte sai da Rodada 2. | Problemas aparentemente separados costumam ser o mesmo sistema. |
| 2026-08-09 | Duas rodadas de perguntas, sem emendar. Rodada 1 = entendimento, Rodada 2 = decisão. | Formato pedido pelo usuário na abertura. |
| 2026-08-09 | Time fixo de três personas com vieses declarados: Marina (dados/integrações), Rafael (produto/recorte), Tomás (infra/custo). | Formato pedido pelo usuário. |
| 2026-08-13 | Repositórios novos nascem **privados** por padrão. | Confirmado no fechamento do P-001. |
| 2026-08-13 | O GitHub App conectado a este workspace **não consegue criar repositórios via API** (403 mesmo após ajuste de permissão pelo usuário). Fluxo que funciona: usuário cria o repo vazio manualmente (privado, com README) → Claude usa `add_repo`/clone local para subir o esqueleto. | Descoberto ao tentar `create_repository` no fechamento do P-001. |
| 2026-08-13 | Spec fechada pode ser revisada antes da implementação começar, sem reabrir as duas rodadas do zero — time analisa a ideia nova, propõe trade-offs e reescreve a spec (marcando "v2") se o usuário confirmar. | Usuário trouxe ideia de site com login logo depois do fechamento v1 do P-001; nenhuma linha de código do v1 tinha sido escrita ainda. |
| 2026-08-13 | P-001 v2: site com catálogo público + área admin (login para 2 usuários, mesma permissão), stack Next.js + Vercel + Supabase, tudo em camada gratuita. PDF saiu do escopo. | Usuário quer compartilhar link com clientes e gerenciar o catálogo junto com a esposa; time recomendou Supabase por resolver banco+auth+storage numa peça só. |

## Preferências do usuário observadas

- Idioma: português do Brasil.
- Quer clareza sobre **quando** cada artefato é criado — não gosta de passo implícito. Ser explícito sobre gatilhos.
- GitHub: conta `caiogavioli`. Repositório de brainstorming: `caiogavioli/Brainstorm`, branch de trabalho `claude/catalogo-produtos-3d-bm2dw2`.
- Modelos 3D do usuário ficam no **MakerWorld** (sem API pública), organizados em pastas de categoria dentro da conta dele.
- Marca: **CMG3D**. Logo enviado (roxo/metálico, tipografia bold angular,
  ilustração de família) — ainda não salvo no repositório do projeto porque
  chegou só inline no chat, não como arquivo; pedir para reenviar como
  anexo quando a implementação visual começar.
- Domínio/hospedagem: aceita gratuito (`*.vercel.app`), sem precisar de
  domínio próprio pago.

## Em aberto

- Scaffold do site `catalogo-produtos-3d` implementado (Next.js + Supabase,
  catálogo público + admin com login/CRUD) na branch `claude/setup-inicial`,
  push feito, PR **não** aberto (ninguém pediu). Falta antes de ir ao ar:
  - Criar o projeto Supabase de verdade, rodar `supabase/schema.sql`, criar
    as 2 contas admin no painel de Auth, preencher `.env.local`.
  - Escrever o script de raspagem do MakerWorld (pasta `scraper/`, ainda
    vazia) para popular produtos iniciais.
  - Deploy no Vercel.
- Logo da CMG3D precisa ser salvo como arquivo real no repo do projeto
  (`assets/logo/`) antes da implementação visual — pedir ao usuário para
  enviar como anexo, não só inline no chat. Por ora o site usa uma paleta
  roxo/metálico placeholder em `src/app/globals.css`.
- Next.js 16 tem um recurso que anexa automaticamente um bloco de
  instruções para agentes de IA ao `CLAUDE.md` toda vez que roda `next dev`
  (`agentRules`). Foi desativado no `next.config.ts` do projeto para manter
  o `CLAUDE.md` sob controle manual, como de costume neste fluxo.
