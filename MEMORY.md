# MEMORY.md

Estado vivo do brainstorming — visão do hub. Ler no início de **toda** sessão, seja qual for o branch, e atualizar ao fim de qualquer rodada ou decisão.

**Última atualização:** 2026-09-02 (cópia local do branch `claude/manual-formulario-aprovacoes-b7k2xr`) — **P-001 fechado.**

---

## Como este repositório está organizado (branch = problema)

`main` é o tronco: o framework (`CLAUDE.md`, `templates/`, `README.md`) e o catálogo abaixo. Cada problema de brainstorming ganha o **seu próprio branch**, criado a partir de `main` — com seus próprios `problemas/`, `sessoes/`, `projetos/` e sua própria cópia de `MEMORY.md` local.

O conteúdo de um branch **não é puxado de volta** para `main` — evita misturar histórias de problemas diferentes numa árvore só. O que volta para `main` é só a **entrada no catálogo abaixo**, para qualquer sessão nova (em qualquer branch) saber o que já existe antes de começar.

**Ao abrir uma sessão nova:** ler este catálogo primeiro.
- Problema já tem branch → continuar nele.
- Problema novo → criar branch a partir de `main`.

**Ao fechar uma rodada, decisão ou projeto em qualquer branch:** voltar aqui em `main` e atualizar a linha correspondente do catálogo. Sem isso ele fica velho de novo e a próxima sessão não enxerga o que já foi feito — foi exatamente essa lacuna que gerou dois branches numerando "P-001" para problemas diferentes, sem um ver o outro.

## Catálogo de branches

| Branch | Natureza | Conteúdo | Status |
|---|---|---|---|
| `claude/client-email-task-tracking-0bcy0q` | Brainstorming completo | P-001 — Controle de pedidos e prazos vindos por email do contratante | **Fechado.** Virou [`caiogavioli/triagem-contratante`](https://github.com/caiogavioli/triagem-contratante) (privado), em produção desde 11/08/2026 |
| `claude/energia-automatizacao-respostas-edhmit` | Brainstorming completo | P-001 (numeração local ao branch) — Controle de respostas dos condomínios sobre automação de energia elétrica | Não virou repositório — era o mesmo problema do `triagem-contratante` visto de outro ângulo. Conectado ao card "Automatização de energia elétrica" no Monday daquele projeto; a planilha no OneDrive criada no caminho foi descartada |
| `claude/project-brainstorming-t0jeoe` | Brainstorming vazio | Genesis original, nunca usado para um problema real | Superado por `main` — candidato a arquivar |
| `claude/condominio-boletim-gestao-ougoqd` | **Código de produto** (Next.js/Prisma) | App de boletim/gestão condominial — "quadro de preenchimento na escala de 50 prédios" | Fora do padrão geral deste repositório (`CLAUDE.md` proíbe código de produto aqui), mas o usuário decidiu conscientemente **manter aqui** (2026-08-12) — não migra para repositório próprio |
| `claude/safetydocs-automation-4rq592` | **Código de produto** + rotina | O mesmo app acima, mais `rotina-safetydocs/` (playbook da rotina agendada "Cobrança SafetyDocs") | Mesma decisão acima — fica aqui. A Routine `trig_01TdEoP9RFiL1uADLHitmSWF` lê `rotina-safetydocs/*.md` **deste branch** — cuidado ao mover ou apagar, quebra automação em produção |
| ~~`claude/python-sql-database-planning-k95885`~~ | Vazio | Sem nenhum commit de conteúdo útil (CLAUDE.md e roadmap.md foram adicionados e depois excluídos) | **Descarte aprovado pelo usuário (2026-08-12).** `git push --delete` voltou 403 — a integração não tem permissão pra apagar branch. Falta a exclusão manual no GitHub |

## Problemas

_Cada branch de brainstorming mantém sua própria tabela de problemas em detalhe — ver o catálogo acima para saber qual branch abrir._

Neste branch (`claude/manual-formulario-aprovacoes-b7k2xr`):

| ID | Título | Fase | Desfecho |
|---|---|---|---|
| P-001 | Manual de preenchimento do formulário de aprovações | **fechado** | virou o par de manuais em `projetos/manual-preenchimento-aprovacoes.md`, publicado direto no repositório [`aprovacoes-contratos-concorrencia`](https://github.com/caiogavioli/aprovacoes-contratos-concorrencia) |

Fases: `apresentado` → `rodada 1` → `rodada 2` → `fechado` / `descartado` / `virou script`

## Projetos fechados

| Projeto | Origem | Repositório | Data |
|---|---|---|---|
| `triagem-contratante` | P-001 (branch `claude/client-email-task-tracking-0bcy0q`) | [caiogavioli/triagem-contratante](https://github.com/caiogavioli/triagem-contratante) (privado) | 2026-08-10 |
| `manual-preenchimento-aprovacoes` | P-001 (branch `claude/manual-formulario-aprovacoes-b7k2xr`) | Não é repositório próprio — entregue em [caiogavioli/aprovacoes-contratos-concorrencia](https://github.com/caiogavioli/aprovacoes-contratos-concorrencia)`/docs/` (privado), commit `94e59a7` | 2026-09-02 |

## Decisões sobre o processo

| Data | Decisão | Contexto |
|---|---|---|
| 2026-08-12 | `main` passa a ser o tronco único do repositório. Cada problema ganha um branch próprio a partir dele; o conteúdo de cada branch não é puxado de volta — só uma entrada no catálogo acima. | O repositório tinha 6 branches divergentes, cada um começado do zero por uma sessão diferente, sem nunca se juntar — dois chegaram a numerar "P-001" para problemas diferentes, sem visibilidade um do outro. Pedido explícito do usuário: consolidar sem perder nem misturar o conteúdo de nenhum branch. |
| 2026-08-09 | Repositório dedicado só é criado no **passo 5**, mediante pedido explícito do usuário. Fim da Rodada 2 não dispara criação. | O usuário perguntou em que momento o repo nasce; alternativa considerada era criar já no fim da Rodada 1, descartada por gerar repositório vazio com nome provisório. |
| 2026-08-09 | Relação problema → repositório não é 1-para-1. O recorte sai da Rodada 2. | Problemas aparentemente separados costumam ser o mesmo sistema. |
| 2026-08-09 | Duas rodadas de perguntas, sem emendar. Rodada 1 = entendimento, Rodada 2 = decisão. | Formato pedido pelo usuário na abertura. |
| 2026-08-09 | Time fixo de três personas com vieses declarados: Marina (dados/integrações), Rafael (produto/recorte), Tomás (infra/custo). | Formato pedido pelo usuário. |

## Preferências do usuário observadas

- Idioma: português do Brasil.
- Quer clareza sobre **quando** cada artefato é criado — não gosta de passo implícito. Ser explícito sobre gatilhos.
- GitHub: conta `caiogavioli`.
- Email de trabalho: Outlook / Microsoft 365. Dispositivos: Windows no computador, Android no celular — soluções precisam funcionar no celular.
- Já paga e usa Microsoft 365 e Monday — preferir encaixar no que já existe a subir peça nova.
- A integração do GitHub **não tem permissão de admin** (`Administration: write`) — não consegue criar repositório, trocar o branch default, nem apagar branch (`git push --delete` e a ausência de ferramenta MCP para isso confirmam). Essas ações precisam ser feitas à mão pelo usuário.
- Aceita ter código de produto neste repositório quando é uma decisão consciente (caso do app de boletim/gestão condominial e da automação SafetyDocs) — a regra do `CLAUDE.md` vale por padrão, não é absoluta.
- É auditado pelas regras de compliance de um cliente seu, a Brookfield Properties (administradora de ativos imobiliários) — ver os procedimentos anexados em P-001 do branch `claude/manual-formulario-aprovacoes-b7k2xr`. No fluxo de aprovação descrito, a administradora prepara o processo e o usuário aprova/assina (contratos e quadros de concorrência); tem ao menos um funcionário próprio que preenche o formulário do sistema de aprovações dele antes da assinatura.

## Em aberto

- **Ação pendente do usuário:** trocar o branch default do repositório para `main` em Settings → Branches no GitHub — a integração não tem permissão para fazer isso via API.
- **Ação pendente do usuário:** apagar o branch `claude/python-sql-database-planning-k95885` no GitHub (Settings → Branches, ou a lista de branches do repositório) — já aprovado, só falta a permissão que a integração não tem.
- Repositórios novos devem nascer **públicos ou privados**? (Pergunta antiga, ainda não confirmada — o único fechamento até aqui, `triagem-contratante`, nasceu privado.)
