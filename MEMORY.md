# MEMORY.md

Estado vivo do brainstorming — visão do hub. Ler no início de **toda** sessão, seja qual for o branch, e atualizar ao fim de qualquer rodada ou decisão.

**Última atualização:** 2026-08-12

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
| `claude/condominio-boletim-gestao-ougoqd` | **Código de produto** (Next.js/Prisma) | App de boletim/gestão condominial — "quadro de preenchimento na escala de 50 prédios" | Fora do padrão deste repositório (`CLAUDE.md` proíbe código de produto aqui). Era, até esta reorganização, o branch **default** do GitHub — provável causa da fragmentação. Avaliar migrar para repositório próprio |
| `claude/safetydocs-automation-4rq592` | **Código de produto** + rotina | O mesmo app acima, mais `rotina-safetydocs/` (playbook da rotina agendada "Cobrança SafetyDocs") | Mesma observação acima. A Routine `trig_01TdEoP9RFiL1uADLHitmSWF` lê `rotina-safetydocs/*.md` **deste branch** — cuidado ao mover ou apagar, quebra automação em produção |
| `claude/python-sql-database-planning-k95885` | Vazio | Sem nenhum commit de conteúdo | Provavelmente abandonado — confirmar com o usuário antes de apagar |

## Problemas

_Cada branch de brainstorming mantém sua própria tabela de problemas em detalhe — ver o catálogo acima para saber qual branch abrir._

## Projetos fechados

| Projeto | Origem | Repositório | Data |
|---|---|---|---|
| `triagem-contratante` | P-001 (branch `claude/client-email-task-tracking-0bcy0q`) | [caiogavioli/triagem-contratante](https://github.com/caiogavioli/triagem-contratante) (privado) | 2026-08-10 |

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
- A integração do GitHub **não tem permissão de admin** (`Administration: write`) — não consegue criar repositório nem trocar o branch default do repositório. As duas ações precisam ser feitas à mão pelo usuário.

## Em aberto

- Definir com o usuário o destino dos branches de código de produto (`condominio-boletim-gestao-ougoqd`, `safetydocs-automation-4rq592`) — migrar para repositórios próprios ou manter aqui por decisão consciente.
- Confirmar se `claude/python-sql-database-planning-k95885` pode ser apagado.
- **Ação pendente do usuário:** trocar o branch default do repositório para `main` em Settings → Branches no GitHub — a integração não tem permissão para fazer isso via API.
- Repositórios novos devem nascer **públicos ou privados**? (Pergunta antiga, ainda não confirmada — o único fechamento até aqui, `triagem-contratante`, nasceu privado.)
