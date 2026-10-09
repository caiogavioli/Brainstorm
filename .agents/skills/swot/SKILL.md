---
name: swot
description: Monta uma análise SWOT (Forças, Fraquezas, Oportunidades, Ameaças) de um cenário para apoiar uma decisão. Use quando o usuário pedir "SWOT", "forças e fraquezas", "enxergar o cenário", ou quando houver uma decisão a tomar (fazer ou não, qual caminho, qual recorte, construir ou comprar) e o contexto ainda estiver difuso. Não use para ordenar itens por prioridade (matriz-gut) nem para mapear as etapas de um processo (sipoc).
---

# SWOT

Serve para **enxergar o cenário antes de decidir**. Sem uma decisão no fim, o SWOT vira inventário — por isso ele sempre termina dizendo o que muda na decisão.

## Regra que mais se erra

O eixo é **controle**, não "bom ou ruim":

| | Ajuda | Atrapalha |
|---|---|---|
| **Interno** — está sob controle de quem decide | **Forças** | **Fraquezas** |
| **Externo** — acontece fora do controle (fornecedor, cliente, regra, ferramenta de terceiros, prazo de terceiros) | **Oportunidades** | **Ameaças** |

Teste rápido: "se eu quisesse, poderia mudar isso sozinho esta semana?" Sim → interno. Não → externo.

## Procedimento

1. **Nomear o objeto e a decisão.** "SWOT de <o quê> para decidir <o quê>". Se o usuário não disse a decisão, perguntar uma vez. Sem decisão, não prosseguir.
2. **Colher do que já foi dito.** Usar as palavras do usuário e dados já registrados. Perguntar só o que falta, e só o que mudaria algum quadrante.
3. **Preencher de 3 a 5 itens por quadrante.** Cada item é específico e carrega a evidência: fala do usuário, número, ou a marca `(hipótese)`. Item sem evidência e sem marca não entra.
4. **Cruzar os quadrantes** (é aqui que o SWOT paga o preço):
   - **F × O** — qual força captura qual oportunidade? (apostar)
   - **F × A** — qual força neutraliza qual ameaça? (defender)
   - **D × O** — qual fraqueza precisa ser corrigida para aproveitar qual oportunidade? (melhorar)
   - **D × A** — fraqueza com ameaça em cima: **risco crítico**. (evitar ou proteger)
5. **Fechar com "O que isso muda na decisão"**: de 1 a 3 conclusões, cada uma ligada a uma ação, a uma pergunta que ainda falta, ou a um "não fazer".

## Formato de saída

```markdown
## SWOT — <objeto>, para decidir <decisão>

**Forças** (interno, ajuda)
- <item> — <evidência>

**Fraquezas** (interno, atrapalha)
- <item> — <evidência>

**Oportunidades** (externo, ajuda)
- <item> — <evidência>

**Ameaças** (externo, atrapalha)
- <item> — <evidência>

**Cruzamentos**
- F×O: <>
- F×A: <>
- D×O: <>
- D×A (risco crítico): <>

**O que isso muda na decisão**
1. <conclusão → ação>
```

## O que evitar

- Itens genéricos que servem para qualquer projeto ("equipe motivada", "mercado competitivo").
- O mesmo fato em dois quadrantes.
- Mais de 5 itens por quadrante: quem lista 15 não priorizou.
- Parar na lista, sem cruzar e sem concluir.
- Preencher quadrante com o que o usuário não disse e não marcar como hipótese.
- Tratar o SWOT como resposta. Ele organiza o argumento; a decisão continua sendo do usuário.

## Registro no repositório Brainstorm

Quando usado dentro do processo deste repositório, as regras de quando entra e onde registrar estão em `CLAUDE.md` (seção "Ferramentas de análise"). Em resumo: abre a Rodada 2, antes das propostas, e uma versão resumida vai para a spec.
