# MEMORY.md

Estado vivo do brainstorming. Ler no início de cada sessão, atualizar ao fim de cada rodada ou decisão.

**Última atualização:** 2026-08-10

---

## Situação atual

**P-001 em Rodada 3, aguardando E1/E2/E3.** A Rodada 2 foi anulada pela medição da caixa (`S-004`): não são 2–3 emails/semana do contratante, são ~65, e o email perdido do dia 05 estava lido e categorizado à mão como `2: FYI` pelo próprio usuário. Diagnóstico correto: **erro de triagem**.

O usuário corrigiu o escopo: monitorar **todos** os emails de `@bgre.com` e `@brookfieldproperties.com`, dividindo-os entre **demanda com prazo** e **informativo**. Categorias existentes ficam **fora de escopo** por decisão dele.

Rodada 3 (`S-005`) entregue com três propostas (A regra nativa / B resumo por LLM / C híbrido) e três decisões abertas: E1 (a máquina classifica × só condensa), E2 (onde a rotina roda), E3 (frequência e se a lista inclui pendências antigas). **O recorte mudou: agora é projeto**, nome provisório `triagem-contratante`. Repositório não criado — sem pedido explícito.

## Problemas

| ID | Título | Fase | Desfecho |
|---|---|---|---|
| P-001 | Controle de pedidos e prazos vindos por email do contratante | rodada 3 | é projeto — `triagem-contratante` (não fechado) |

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
