# MEMORY.md

Estado vivo do brainstorming. Ler no início de cada sessão, atualizar ao fim de cada rodada ou decisão.

**Última atualização:** 2026-08-12

---

## Situação atual

**P-001 encerrado.** Virou o projeto `triagem-contratante`, com repositório privado criado e esqueleto no ar: <https://github.com/caiogavioli/triagem-contratante>. O desenvolvimento acontece **lá**, em outra sessão — aqui fica só o histórico da decisão.

Última decisão tomada (2026-08-10): **entrega por email**, do usuário para ele mesmo, assunto `[Triagem] …`. Ele responde o próprio email para fechar pedidos, e o loop se fecha dentro da caixa dele. Foi avisado do risco de a rotina cair sem aviso e **aceitou explicitamente**.

**Em produção desde 11/08/2026.** A rotina diária rodou sozinha pela primeira vez às 07h30, disparada pelo agendamento, sem ninguém pedir — leu a caixa, leu e atualizou o quadro no Monday e entregou a mensagem. O projeto saiu do papel.

Nada em aberto neste repositório. Pronto para o próximo problema.

Caminho até aqui: Rodada 1 (`S-001`) → Rodada 2 (`S-002`) → decisão (`S-003`) → **medição da caixa anulou a premissa** (`S-004`) → Rodada 3 com o problema corrigido (`S-005`) → decisões E1/E2/E3 fechadas.

Decisões finais: a máquina **classifica** e o humano confere (E1 = a); rotina agendada sem servidor (E2); **1x/dia de manhã, com histórico dos pedidos anteriores em aberto** (E3, histórico exigido pelo usuário).

## Problemas

| ID | Título | Fase | Desfecho |
|---|---|---|---|
| P-001 | Controle de pedidos e prazos vindos por email do contratante | **fechado** | virou o repo [`triagem-contratante`](https://github.com/caiogavioli/triagem-contratante) |

Fases: `apresentado` → `rodada 1` → `rodada 2` → `fechado` / `descartado` / `virou script`

## Projetos fechados

| Projeto | Origem | Repositório | Data |
|---|---|---|---|
| `triagem-contratante` | P-001 | **[caiogavioli/triagem-contratante](https://github.com/caiogavioli/triagem-contratante)** (privado) | 2026-08-10 |

### Nota de permissão do GitHub (2026-08-10)

A integração **não consegue criar repositórios** — `POST /user/repos` volta `403 Resource not accessible by integration` (falta `Administration: write`). Ela autentica como `caiogavioli` e opera normalmente em repositórios que já existem.

**Nos próximos fechamentos:** pedir ao usuário que crie o repositório vazio à mão (privado, sem inicializar com README), e então usar `add_repo` + clone + push. O caminho funcionou sem atrito.

Esqueleto subido: `README.md`, `CLAUDE.md`, `.gitignore`, `docs/spec.md`, `rotina/criterios-classificacao.md`, `rotina/formato-mensagem.md`, `estado/pedidos.exemplo.json`, `testes/caso-referencia.md`.

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

### Datas de recebimento adulteradas de propósito (2026-08-12)

Alguns emails do contratante aparecem com `receivedDateTime` **no futuro** (ano 2028) enquanto o `sentDateTime` continua correto. Quatro casos observados, todos de 2026: 24/07, 22/05, 31/03 e 30/03.

**Não é corrupção de dados.** O usuário informou que **ele mesmo alterou** essas datas, deliberadamente, para fixar os emails no topo da caixa do Outlook. É o marcador manual de importância dele.

Consequências para a rotina:
- **Sempre usar `sentDateTime`** para ordenar, filtrar janela de 24h e calcular dias parado. `receivedDateTime` não é confiável nessa caixa.
- Uma data futura é **sinal positivo de relevância**, não anomalia. Não tratar como erro, não avisar como defeito e nunca sugerir "consertar" — a rotina não escreve na caixa.
- A janela de 24h por `receivedDateTime` deixaria esses emails invisíveis para sempre; por `sentDateTime` eles entram na varredura correta.

> Lição de processo: antes de chamar um dado estranho de "corrompido", perguntar. Este ficou dois dias sendo relatado como defeito do Outlook, quando era o usuário trabalhando.

## Em aberto

- Repositórios novos devem nascer **públicos ou privados**? Confirmar no primeiro fechamento.
- Nada em aberto. Próximo problema quando o usuário trouxer.
- Pendência que viaja para a sessão de desenvolvimento de `triagem-contratante`: a **linguagem de implementação** não foi decidida — a spec fecha arquitetura, não stack de código.

## Preferências de comunicação observadas

- **Prefere explicação simples e direta.** Pediu explicitamente para reduzir a complexidade quando as três decisões técnicas foram apresentadas juntas com o debate das personas. Apresentar exemplo concreto do produto final funciona muito melhor do que tabela de trade-off.
- Decide rápido quando a pergunta é uma só e binária. Trava quando são três decisões simultâneas com jargão.
- **Tomar as decisões técnicas por ele** e informar em uma linha o que foi decidido e por quê, deixando espaço para discordar.
