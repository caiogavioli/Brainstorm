# MEMORY.md

Estado vivo do brainstorming. Ler no início de cada sessão, atualizar ao fim de cada rodada ou decisão.

**Última atualização:** 2026-08-10

---

## Situação atual

**P-001 com a Rodada 2 reaberta.** O usuário decidiu D1+D2+D3 (`S-003`) e autorizou montar a camada 1. Ao medir a caixa para descobrir os remetentes, **a premissa caiu** (`S-004`): não são 2–3 emails/semana do contratante, são ~65; a Inbox recebe 352/semana. E o email perdido do dia 05 foi identificado — estava **lido e categorizado `2: FYI`**, com o usuário no campo *para* e prazo explícito no corpo. Diagnóstico correto: **erro de triagem**, não falta de notificação.

Decisão suspensa, camada 1 não executada, nada alterado na caixa. Três perguntas bloqueiam o próximo passo (taxonomia de categorias, quem aplica, confirmação do volume).

## Problemas

| ID | Título | Fase | Desfecho |
|---|---|---|---|
| P-001 | Controle de pedidos e prazos vindos por email do contratante | rodada 2 (reaberta) | em aberto — recorte provável mudou para triagem |

Fases: `apresentado` → `rodada 1` → `rodada 2` → `fechado` / `descartado` / `virou script`

## Projetos fechados

| Projeto | Origem | Repositório | Data |
|---|---|---|---|
| — | — | — | — |

## Decisões sobre o processo

| Data | Decisão | Contexto |
|---|---|---|
| 2026-08-09 | Repositório dedicado só é criado no **passo 5**, mediante pedido explícito do usuário. Fim da Rodada 2 não dispara criação. | O usuário perguntou em que momento o repo nasce; alternativa considerada era criar já no fim da Rodada 1, descartada por gerar repositório vazio com nome provisório. |
| 2026-08-09 | Relação problema → repositório não é 1-para-1. O recorte sai da Rodada 2. | Problemas aparentemente separados costumam ser o mesmo sistema. |
| 2026-08-09 | Duas rodadas de perguntas, sem emendar. Rodada 1 = entendimento, Rodada 2 = decisão. | Formato pedido pelo usuário na abertura. |
| 2026-08-09 | Time fixo de três personas com vieses declarados: Marina (dados/integrações), Rafael (produto/recorte), Tomás (infra/custo). | Formato pedido pelo usuário. |

## Preferências do usuário observadas

- Idioma: português do Brasil.
- Quer clareza sobre **quando** cada artefato é criado — não gosta de passo implícito. Ser explícito sobre gatilhos.
- GitHub: conta `caiogavioli`. Repositório de brainstorming: `caiogavioli/Brainstorm`, branch de trabalho `claude/project-brainstorming-t0jeoe`.

### Ambiente e ferramentas (levantado em P-001, Rodada 1)

- **Email de trabalho: Outlook / Microsoft 365**, caixa pessoal não compartilhada.
- **Dispositivos:** Windows no computador, **Android** no celular. Solução precisa funcionar no celular.
- **Já paga e usa:** Microsoft 365 e **Monday**. Preferir encaixar no que já existe a subir peça nova.
- **Automação:** quer ser **perguntado antes**, não aceita criação silenciosa de tarefas.
- **Sem restrições de compliance** sobre onde armazenar conteúdo dos emails do contratante.
- Tem um contratante que também o aciona por **WhatsApp**, majoritariamente para cobrar respostas de email.

### Contexto real do trabalho (medido na caixa, 2026-08-10)

- Conta `caio@dfsindicos.com.br` — **DF Síndicos**, síndico profissional de vários ativos corporativos e logísticos.
- Colegas: `denise@dfsindicos.com.br`, `amanda@dfsindicos.com.br`.
- **Contratante = Brookfield**, em dois domínios ativos ao mesmo tempo: `@bgre.com` (novo) e `@brookfieldproperties.com` (antigo). Qualquer regra precisa cobrir os dois.
- Administradoras no fluxo: CBRE, Cushman & Wakefield, Innova, Hines.
- Volume real em 7 dias: **352** na Inbox, **~65** do contratante, **90** da CBRE.
- **O usuário já usa categorias numeradas no Outlook** (`2: FYI` observada). Taxonomia completa ainda desconhecida.

> Lição de processo: **auto-relato de volume não é dado confiável.** Medir a fonte antes de desenhar em cima do número.

## Em aberto

- Repositórios novos devem nascer **públicos ou privados**? Confirmar no primeiro fechamento.
- **D1/D2/D3 de P-001** aguardando o usuário (ver `sessoes/S-002-*.md`).
