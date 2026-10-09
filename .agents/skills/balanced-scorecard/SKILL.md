---
name: balanced-scorecard
description: Transforma uma estratégia ou objetivo de projeto em indicadores, metas e iniciativas usando o Balanced Scorecard (Financeira, Cliente, Processos internos, Aprendizado e crescimento). Use quando o usuário pedir "Balanced Scorecard", "BSC", "indicadores", "metas", "como medir se deu certo", ou ao definir o critério de sucesso e a revisão de um projeto. Não use para ordenar prioridades (matriz-gut) nem para entender o cenário (swot).
---

# Balanced Scorecard (BSC)

Serve para **transformar o objetivo em números acompanháveis**, olhando o projeto por quatro lados para não otimizar um e quebrar outro (ganhar tempo e perder qualidade, por exemplo).

## As quatro perspectivas, na escala de um projeto pequeno

| Perspectiva | Pergunta | Exemplos de indicador |
|---|---|---|
| **Financeira** | O que isso economiza ou protege em dinheiro e tempo? | horas/semana economizadas, custo mensal da solução, valor protegido (retenção, multa evitada) |
| **Cliente** | Quem recebe o resultado fica melhor servido? | prazo de entrega, reclamações, satisfação de quem recebe a saída, adesão |
| **Processos internos** | O trabalho ficou mais rápido, correto e confiável? | tempo de ciclo, taxa de erro/retrabalho, % automatizado, execuções que falham |
| **Aprendizado e crescimento** | A capacidade de manter e evoluir cresceu? | pessoas que sabem operar, dependência do autor, documentação em dia, tempo para corrigir um defeito |

Cadeia de causa e efeito: **Aprendizado → Processos → Cliente → Financeira**. Cada indicador de baixo deve explicar um de cima. Escrever essa cadeia em uma linha.

## Estrutura de cada linha

| Objetivo | Indicador | Linha de base (hoje) | Meta e prazo | Fonte e quem mede | Iniciativa do projeto |
|---|---|---|---|---|---|

## Regras

1. **Linha de base é obrigatória.** Sem o número de hoje, meta é opinião. Se não existe medição, a primeira iniciativa é medir — registrar assim, sem inventar o número.
2. **Um ou dois objetivos por perspectiva, um indicador por objetivo.** Quatro a oito linhas no total já é muito para projeto pequeno.
3. **Perspectiva que não se aplica** recebe `Não se aplica — <motivo>`. Não preencher por preencher.
4. **Medir não pode custar mais do que o ganho.** Se o indicador exige trabalho manual novo, trocar por um que sai de dado que já existe.
5. **Meta com prazo e dono.** "Reduzir o tempo" não é meta; "de 3 h para 30 min por semana até 30 dias após entrar em produção" é.
6. **Misturar indicador de resultado (o que se quer) com indicador de causa (o que move o resultado)**, para dar tempo de reagir antes do resultado aparecer.
7. **Marcar a revisão:** data (30 e 90 dias após a entrega) e quem olha. Indicador sem revisão é decoração.
8. **A fonte do dado precisa existir**: dizer de onde sai o número e quem o coleta.

## Formato de saída

```markdown
## Balanced Scorecard — <projeto>

**Objetivo do projeto (a "estratégia"):** <uma frase>
**Cadeia de causa e efeito:** <Aprendizado → Processos → Cliente → Financeira, em uma linha>

| Perspectiva | Objetivo | Indicador | Linha de base | Meta e prazo | Fonte / quem mede | Iniciativa |
|---|---|---|---|---|---|---|
| Financeira | | | | | | |
| Cliente | | | | | | |
| Processos internos | | | | | | |
| Aprendizado e crescimento | | | | | | |

**Revisão:** <data>, por <quem>
**Sem linha de base ainda:** <o que precisa ser medido antes de entrar em produção>
```

## O que evitar

- Painel de 20 indicadores que ninguém lê.
- Métrica de vaidade: número que sobe e não muda nenhuma decisão.
- Meta sem prazo ou sem dono.
- Copiar o BSC de empresa grande para um projeto de um usuário só.
- Inventar linha de base.

## Registro no repositório Brainstorm

Quando usado dentro do processo deste repositório, as regras de quando entra e onde registrar estão em `CLAUDE.md` (seção "Ferramentas de análise"). Em resumo: uma proposta de indicadores fecha a Rodada 2 (para o usuário confirmar) e a versão final vai para a spec, com data de revisão.
