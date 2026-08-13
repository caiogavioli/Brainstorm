# MEMORY.md

Estado vivo do brainstorming. Ler no início de cada sessão, atualizar ao fim de cada rodada ou decisão.

**Última atualização:** 2026-08-13

---

## Situação atual

Primeiro projeto fechado: catálogo de produtos de impressão 3D (P-001).
Repositório criado e esqueleto no ar.

## Problemas

| ID | Título | Fase | Desfecho |
|---|---|---|---|
| P-001 | Catálogo de produtos de impressão 3D | fechado | virou repo `catalogo-produtos-3d` |

Fases: `apresentado` → `rodada 1` → `rodada 2` → `fechado` / `descartado` / `virou script`

## Projetos fechados

| Projeto | Origem | Repositório | Data |
|---|---|---|---|
| Catálogo de produtos de impressão 3D | P-001 | [caiogavioli/catalogo-produtos-3d](https://github.com/caiogavioli/catalogo-produtos-3d) | 2026-08-13 |

## Decisões sobre o processo

| Data | Decisão | Contexto |
|---|---|---|
| 2026-08-09 | Repositório dedicado só é criado no **passo 5**, mediante pedido explícito do usuário. Fim da Rodada 2 não dispara criação. | O usuário perguntou em que momento o repo nasce; alternativa considerada era criar já no fim da Rodada 1, descartada por gerar repositório vazio com nome provisório. |
| 2026-08-09 | Relação problema → repositório não é 1-para-1. O recorte sai da Rodada 2. | Problemas aparentemente separados costumam ser o mesmo sistema. |
| 2026-08-09 | Duas rodadas de perguntas, sem emendar. Rodada 1 = entendimento, Rodada 2 = decisão. | Formato pedido pelo usuário na abertura. |
| 2026-08-09 | Time fixo de três personas com vieses declarados: Marina (dados/integrações), Rafael (produto/recorte), Tomás (infra/custo). | Formato pedido pelo usuário. |
| 2026-08-13 | Repositórios novos nascem **privados** por padrão. | Confirmado no fechamento do P-001. |
| 2026-08-13 | O GitHub App conectado a este workspace **não consegue criar repositórios via API** (403 mesmo após ajuste de permissão pelo usuário). Fluxo que funciona: usuário cria o repo vazio manualmente (privado, com README) → Claude usa `add_repo`/clone local para subir o esqueleto. | Descoberto ao tentar `create_repository` no fechamento do P-001. |

## Preferências do usuário observadas

- Idioma: português do Brasil.
- Quer clareza sobre **quando** cada artefato é criado — não gosta de passo implícito. Ser explícito sobre gatilhos.
- GitHub: conta `caiogavioli`. Repositório de brainstorming: `caiogavioli/Brainstorm`, branch de trabalho `claude/catalogo-produtos-3d-bm2dw2`.
- Modelos 3D do usuário ficam no **MakerWorld** (sem API pública), organizados em pastas de categoria dentro da conta dele.

## Em aberto

- Stack de preferência do usuário ainda desconhecida além do que surgiu no P-001 (Python local). Confirmar em próximos projetos.
- Implementação do scraper/gerador de PDF do `catalogo-produtos-3d` ainda não começou — é trabalho de outra sessão, no repositório novo.
