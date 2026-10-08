# MEMORY.md

Estado vivo do brainstorming — visão do hub. Ler no início de **toda** sessão, seja qual for o branch, e atualizar ao fim de qualquer rodada ou decisão.

**Última atualização:** 2026-10-08 (DP Cajamar)

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
| `claude/manual-formulario-aprovacoes-b7k2xr` | Brainstorming completo | P-001 — Manual de preenchimento do formulário de aprovações que o funcionário do usuário usa antes dele assinar contratos e quadros de concorrência (regras vêm dos procedimentos de compliance do cliente dele, a Brookfield Properties) | **Fechado.** Não virou repositório novo — os dois manuais (Markdown + PDF) foram publicados direto em [`caiogavioli/aprovacoes-contratos-concorrencia`](https://github.com/caiogavioli/aprovacoes-contratos-concorrencia)`/docs/` (privado), o repositório do sistema de aprovações que eles documentam |
| `claude/clinic-popup-design-qmebur` | Brainstorming em andamento | P-001 — Pop-up para clínica de atendimento e vacinas (objetivo exato ainda não definido — apresentação inicial muito enxuta) | **Rodada 1 aberta** — perguntas feitas, aguardando respostas do usuário |
| `claude/contract-approval-system-mo09qm` | Não usou o processo deste repositório | Pedido: importação mensal, sob demanda, dos dados do Monday no sistema de aprovações | **Não é um problema deste repositório.** O usuário pediu direto para implementar em [`caiogavioli/aprovacoes-contratos-concorrencia`](https://github.com/caiogavioli/aprovacoes-contratos-concorrencia) (fora daqui) — perguntado explicitamente se queria seguir o processo Marina/Rafael/Tomás ou ir direto ao repo do sistema; escolheu ir direto. Sem Rodada 1/2, sem `problemas/`/`sessoes/` neste branch. Entregue: `/admin/import` agora busca os dois boards ao vivo na API do Monday a cada clique (antes lia um snapshot estático), commit `18a8525` |
| `claude/einstein-rfp-representante-condominial` | Análise de concorrência (não é software) | P-001 — Concorrência do Einstein para Representante Condominial (subsíndico profissional) das unidades Artur de Azevedo, Pinheiros e Parque Global, disputada pela DF Síndicos | **Proposta revisada montada (S-002).** 12 pedidos do Einstein respondidos e aprovados; textos finais em `entregas/`. Falta diagramar e enviar (prazo 01/10/2026) |
| `claude/budget-forecast-analysis-ujaw4z` | Brainstorming completo | P-001 — Análise e parecer das previsões orçamentárias de condomínios enviadas pelas administradoras (conferência de reajuste, índices, somas e fórmulas) | **Fechado (2026-10-01).** Virou [`caiogavioli/analise-previsao-orcamentaria`](https://github.com/caiogavioli/analise-previsao-orcamentaria) (privado), esqueleto publicado. **Modelo v1 encerrado e aprovado (2026-10-01), revisado no mesmo dia: cada rodada gera DOIS arquivos (relatório ao condomínio e planilha de respostas; a orientação ao analista foi descontinuada e o relatório não tem seção "Limites"); padrão para todos os condomínios; só o *Concordo* do usuário fecha um "Esclarecer". Fluxo por condomínio validado: nova análise independente × revisão que retoma a última rodada (`estado.json` no OneDrive); raiz em uso: `Operacional/Claude/Análise de previsão orçamentária` no OneDrive do Marco (identificadores em `docs/fluxo-por-condominio.md` do repositório novo). Atrium 2027 rodada 1 **analisada e com os dois arquivos finais gerados (2026-10-01; 3 críticos, 9 moderados, 5 baixos); falta o usuário enviar à Innova**. Regras novas: **tabela em imagem é sempre crítica** (pedir Excel); o analista não "concorda" com os apontamentos, só marca Ajustar/Retirar.** **Ciclo em dois documentos (2026-10-01):** relatório de apontamentos ao condomínio (resumo dos itens a corrigir, matriz de riscos, questionário em planilha à administradora; repete a cada reapresentação) e parecer final ao proprietário (só com zero críticos). Próximo passo é lá: construir o verificador com o piloto Atrium Santo André PO 2027 e validar o rascunho do relatório |

## Problemas

_Cada branch de brainstorming mantém sua própria tabela de problemas em detalhe — ver o catálogo acima para saber qual branch abrir._

## Projetos fechados

| Projeto | Origem | Repositório | Data |
|---|---|---|---|
| `triagem-contratante` | P-001 (branch `claude/client-email-task-tracking-0bcy0q`) | [caiogavioli/triagem-contratante](https://github.com/caiogavioli/triagem-contratante) (privado) | 2026-08-10 |
| `manual-preenchimento-aprovacoes` | P-001 (branch `claude/manual-formulario-aprovacoes-b7k2xr`) | Não é repositório próprio — entregue em [caiogavioli/aprovacoes-contratos-concorrencia](https://github.com/caiogavioli/aprovacoes-contratos-concorrencia)`/docs/` (privado), commit `94e59a7` | 2026-09-02 |
| `analise-previsao-orcamentaria` | P-001 (branch `claude/budget-forecast-analysis-ujaw4z`) | [caiogavioli/analise-previsao-orcamentaria](https://github.com/caiogavioli/analise-previsao-orcamentaria) (privado), commit `9d6ebca` | 2026-10-01 |

## Decisões sobre o processo

| Data | Decisão | Contexto |
|---|---|---|
| 2026-08-12 | `main` passa a ser o tronco único do repositório. Cada problema ganha um branch próprio a partir dele; o conteúdo de cada branch não é puxado de volta — só uma entrada no catálogo acima. | O repositório tinha 6 branches divergentes, cada um começado do zero por uma sessão diferente, sem nunca se juntar — dois chegaram a numerar "P-001" para problemas diferentes, sem visibilidade um do outro. Pedido explícito do usuário: consolidar sem perder nem misturar o conteúdo de nenhum branch. |
| 2026-08-09 | Repositório dedicado só é criado no **passo 5**, mediante pedido explícito do usuário. Fim da Rodada 2 não dispara criação. | O usuário perguntou em que momento o repo nasce; alternativa considerada era criar já no fim da Rodada 1, descartada por gerar repositório vazio com nome provisório. |
| 2026-08-09 | Relação problema → repositório não é 1-para-1. O recorte sai da Rodada 2. | Problemas aparentemente separados costumam ser o mesmo sistema. |
| 2026-08-09 | Duas rodadas de perguntas, sem emendar. Rodada 1 = entendimento, Rodada 2 = decisão. | Formato pedido pelo usuário na abertura. |
| 2026-08-09 | Time fixo de três personas com vieses declarados: Marina (dados/integrações), Rafael (produto/recorte), Tomás (infra/custo). | Formato pedido pelo usuário. |

## Preferências do usuário observadas

- Relatórios que acusam erro de terceiro: quer mostrar **primeiro ao condomínio** o que está errado, com **matriz de riscos** (crítico / não crítico) e **sugestões para validar**, e só depois emitir o relatório final ao proprietário (2026-10-01). Gosta de validar antes de enviar.
- Equipe de 4 pessoas, mas **só o usuário tem Claude Code pago** (2026-10-01). Soluções que dependem de a equipe rodar Claude Code não servem; a equipe consome saídas (arquivos no OneDrive).
- Para a análise de previsões orçamentárias: **só computador**, celular fora do escopo (2026-10-01). Já aceitou que arquivos de condomínios fiquem em OneDrive/Drive (não GitHub).
- O conector Microsoft 365 desta sessão lê anexos de email e arquivos do OneDrive/SharePoint **como texto com valores, sem fórmulas**, e não baixa o arquivo; para auditar fórmula, o arquivo precisa estar em disco (execução local).
- Idioma: português do Brasil.
- Quer clareza sobre **quando** cada artefato é criado — não gosta de passo implícito. Ser explícito sobre gatilhos.
- GitHub: conta `caiogavioli`.
- Email de trabalho: Outlook / Microsoft 365. Dispositivos: Windows no computador, Android no celular — soluções precisam funcionar no celular.
- Já paga e usa Microsoft 365 e Monday — preferir encaixar no que já existe a subir peça nova.
- A integração do GitHub **não tem permissão de admin** (`Administration: write`) — não consegue criar repositório, trocar o branch default, nem apagar branch (`git push --delete` e a ausência de ferramenta MCP para isso confirmam). Essas ações precisam ser feitas à mão pelo usuário.
- Aceita ter código de produto neste repositório quando é uma decisão consciente (caso do app de boletim/gestão condominial e da automação SafetyDocs) — a regra do `CLAUDE.md` vale por padrão, não é absoluta.
- É auditado pelas regras de compliance de um cliente seu, a Brookfield Properties (administradora de ativos imobiliários) — procedimentos anexados em P-001 do branch `claude/manual-formulario-aprovacoes-b7k2xr`. Tem outro sistema próprio (fora deste repositório): [`caiogavioli/aprovacoes-contratos-concorrencia`](https://github.com/caiogavioli/aprovacoes-contratos-concorrencia), que registra o checklist de conferência antes de ele assinar contratos e quadros de concorrência dos 11 condomínios da carteira, administrados por CBRE/Cushman/Innova/HFlex.
- Quando o pedido é um documento (não software), aceita bem a entrega ir direto para dentro do repositório que ele documenta, sem abrir repositório novo no Brainstorm nem em outro lugar (decisão de P-001, 2026-09-02) — mesmo raciocínio de custo/peça-móvel que já vinha aparecendo nas decisões anteriores.

## Em aberto

- **17007 Nações 2027, rodada 1 (rev 6):** enviada à CBRE em 2026-10-01 (17 apontamentos). Após o `.xlsx`, **revisão 1** (23 apontamentos: 6 críticos, 8 moderados, 9 baixos) validada em 2026-10-02 e com os dois arquivos finais gerados; falta o usuário reenviar à CBRE. Convenção dispensada; materialidade sobre o total dos 5 centros.
- **Passeio Paulista 2027, rodada 1:** analisada, validada em 2026-10-02 (22 apontamentos: 7 críticos, 7 moderados, 8 baixos) e com os dois arquivos finais gerados; falta o usuário enviar à administradora e confirmar o nome dela (Cushman & Wakefield a confirmar). Sem convenção.
- **O Parque Torre 07 2027, rodada 1:** analisada, validada em 2026-10-05 (19 apontamentos: 4 críticos, 9 moderados, 6 baixos) e com os dois arquivos finais gerados; falta o usuário enviar à administradora e informar o nome dela (o relatório diz "a confirmar"). Sem convenção: base de área (BOMA × ABL) e fundo de reserva a esclarecer.
- **Jacarandá 2027, rodada 1:** analisada, validada em 2026-10-06 (24 apontamentos: 8 críticos, 12 moderados, 4 baixos) e com os dois arquivos finais gerados; falta o usuário enviar à Cushman & Wakefield (nome confirmado pelo usuário em 2026-10-06 e já refletido na versão final). Sem convenção. Material: apresentação, previsão e fluxo do fundo de contingência.
- **DP Cajamar 2027, rodada 1:** analisada, validada em 2026-10-08 (22 apontamentos: 10 críticos, 10 moderados, 2 baixos) e com os dois arquivos finais gerados; falta o usuário enviar à administradora e confirmar o nome (o relatório diz "Hines (a confirmar)"). Sem convenção. A planilha enviada não é da versão da apresentação: reconferir quando chegar a planilha que gerou os slides.
- **Atrium 2027, rodada 1:** enviada à Innova em 2026-10-01; aguardando a reapresentação da previsão.

- Piloto de `analise-previsao-orcamentaria`: Atrium Santo André (setor Office), PO 2027, Innova, recebida em 29/09/2026. Casos **confirmados no arquivo real, com fórmulas** (8 de 9 + 8 novos, incluindo apresentação × planilha) em `docs/casos-piloto-atrium-2027.md` do repositório novo, commit `342f92d`. Falta virar verificador com teste.
- Repositórios novos devem nascer **públicos ou privados**? (Pergunta antiga, ainda não confirmada — o único fechamento até aqui, `triagem-contratante`, nasceu privado.)
