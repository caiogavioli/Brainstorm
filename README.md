# Brainstorm

Repositório de trabalho para **descoberta e definição de projetos**. Nada de código de produto mora aqui — aqui moram os problemas, as discussões e as especificações. Quando um projeto é fechado, ele vira **um repositório novo e próprio** no GitHub.

## Como funciona

```
1. PROBLEMAS   você descreve problemas e rotinas que quer resolver
      ↓
2. RODADA 1    o time sênior faz perguntas de entendimento
      ↓
3. RODADA 2    o time faz perguntas de decisão + propõe caminhos
      ↓
4. SPEC        vira um documento de projeto fechado
      ↓
5. REPO        você diz "fecha esse projeto" → criamos o repositório dedicado
```

## O time

| Quem | Perfil | Puxa a discussão para |
|---|---|---|
| **Marina** | Backend / dados / integrações. 12 anos, muito tempo em ETL, filas e sistemas que rodam sozinhos de madrugada. | Onde o dado nasce, quem é a fonte da verdade, o que acontece quando falha |
| **Rafael** | Produto / full-stack. 10 anos, já matou muito projeto que ninguém usava. | Quem usa, com que frequência, qual o menor recorte que já entrega valor |
| **Tomás** | Infra / automação / custo. 15 anos, alérgico a complexidade desnecessária. | Onde roda, quanto custa, quem mantém, o que quebra em 6 meses |

As três rodadas são conduzidas por escrito, aqui no chat. As respostas ficam registradas nos arquivos deste repo.

## Ferramentas de análise

Quatro ferramentas de gestão entram no processo, cada uma no momento em que resolve uma pergunta específica. O time as aciona sozinho nos gatilhos abaixo; você também pode chamá-las a qualquer hora.

| Ferramenta | Pergunta que responde | Entra sozinha quando | Para chamar à mão |
|---|---|---|---|
| **GUT** — Gravidade, Urgência, Tendência | "O que ataco primeiro?" | você apresenta 2+ problemas, ou diz que tudo é prioridade; e na spec, para separar v1 de v2 | `/matriz-gut` ou "Priorize estes problemas com Matriz GUT e mostre os 3 que devo atacar primeiro" |
| **SIPOC** — Fornecedores, Entradas, Etapas, Saídas, Clientes | "Como o processo funciona de ponta a ponta?" | abre a Rodada 1 (processo atual); volta na spec (processo futuro) | `/sipoc` ou "Organize este processo em SIPOC e mostre entradas, etapas, saídas e clientes" |
| **SWOT** — Forças, Fraquezas, Oportunidades, Ameaças | "Qual é o cenário antes de decidir?" | abre a Rodada 2, antes das propostas | `/swot` ou "Faça uma SWOT deste cenário e destaque o que exige decisão ou ação agora" |
| **Balanced Scorecard** — Financeira, Cliente, Processos, Aprendizado | "Como vou saber que deu certo?" | fecha a Rodada 2 (proposta) e a spec (versão final, com data de revisão) | `/balanced-scorecard` ou "Monte um Balanced Scorecard com objetivos, indicadores, metas e iniciativas" |

```
1. APRESENTAÇÃO  ········· GUT   (se houver 2+ problemas)
2. RODADA 1      ········· SIPOC do hoje, as lacunas "?" viram perguntas
3. RODADA 2      ········· SWOT na abertura · indicadores (BSC) propostos no recorte
4. SPEC          ········· SIPOC hoje/depois · GUT v1/v2 · SWOT resumido · BSC final
5. REPO          ········· revisão dos indicadores marcada para 30 dias após a entrega
```

Três coisas para saber:

- **Proporcional ao tamanho.** Um script não leva as quatro. No fim da Rodada 2, Rafael diz quanto de cada ferramenta o recorte merece (tabela de dosagem em `CLAUDE.md`).
- **Só com o que você disse.** Cada item cita sua fala; o que é suposição vem marcado `(hipótese)`. As notas do GUT são proposta: você ajusta.
- **Linha de base antes de meta.** O scorecard só fecha com o número de hoje (tempo, erro, custo). Se ninguém mede, a primeira tarefa do projeto é medir.

## Estrutura

```
problemas/      um arquivo por problema/rotina apresentado
sessoes/        transcrição das rodadas de perguntas e decisões
projetos/       specs fechadas, prontas para virar repositório
templates/      modelos usados acima (problema, sessão, projeto)
.agents/        skills instaladas (fonte); symlinks em .claude/skills
.claude/        skills, agente e comando que o Claude Code carrega
```

## Um branch por problema

`main` só tem o framework acima. Cada problema ganha o seu próprio branch a partir de `main`, com seu próprio `problemas/` / `sessoes/` / `projetos/`. O catálogo de quais branches existem e o que cada um contém vive em `MEMORY.md`, aqui em `main` — é o primeiro arquivo a ler em qualquer sessão nova.

## Estado atual

Ver o catálogo de branches em `MEMORY.md`.
