---
name: sipoc
description: Mapeia um processo inteiro em SIPOC (Suppliers/Fornecedores, Inputs/Entradas, Process/Etapas, Outputs/Saídas, Customers/Clientes) — do jeito que ele é hoje ou do jeito que vai ficar. Use quando o usuário pedir "SIPOC", "mapear o processo", "entender a rotina de ponta a ponta", ou quando uma rotina for descrita e ainda não está claro de onde vêm as coisas, o que sai e quem recebe. Não use para ordenar prioridades (matriz-gut) nem para detalhar cada clique de um fluxo (isso é fluxograma, não SIPOC).
---

# SIPOC

Serve para **entender um processo inteiro numa tabela só**: quem fornece o quê, o que entra, o que se faz, o que sai e para quem. É visão de helicóptero — de 4 a 7 etapas, não 20.

## Dois modos

- **Atual (as-is):** o processo **como é de fato**, não como deveria ser. Se o usuário descreve o ideal, perguntar "e na prática, quando isso falha ou foge disso?".
- **Futuro (to-be):** o processo depois da solução. Sempre vem acompanhado de **o que muda em relação ao atual** — etapa que some, etapa que automatiza, etapa que continua manual por decisão.

## Ordem de montagem

Não preencher da esquerda para a direita. Preencher assim:

1. **Fronteiras:** onde o processo começa (gatilho) e onde termina.
2. **Process (P):** de 4 a 7 etapas, cada uma verbo + objeto ("conferir relatório", não "relatório").
3. **Outputs (O) e Customers (C):** o que sai de cada etapa e quem **realmente** consome. Saída sem cliente é trabalho desperdiçado.
4. **Inputs (I) e Suppliers (S):** o que cada etapa precisa para rodar e **quem entrega**. Anotar o formato e o canal entre parênteses (PDF por e-mail, planilha no OneDrive).

## Marcar o que não se sabe

Célula que o usuário ainda não informou recebe **`?`**. Cada `?` é uma pergunta pendente, e a lista de `?` é a base das perguntas de entendimento — nada de perguntar o que já está preenchido.

## Formato de saída

```markdown
## SIPOC (atual | futuro) — <nome do processo>

**Começa quando:** <gatilho>   **Termina quando:** <resultado>

| # | Fornecedor (S) | Entrada (I) | Etapa (P) | Saída (O) | Cliente (C) |
|---|---|---|---|---|---|
| 1 | | | | | |

**Pontos de dor:** <etapas onde dói — com tempo, erro ou retrabalho>
**Exceções:** <o que acontece quando a entrada não chega, chega duplicada, chega errada, ou a etapa roda duas vezes>
**Lacunas (?):** <lista do que falta saber>
**O que muda em relação ao atual:** <só no modo futuro>
```

## Checagens antes de entregar

- Toda etapa tem verbo e produz alguma saída.
- Toda entrada tem fornecedor com dono ("o sistema" não é fornecedor; quem mantém o sistema é).
- Toda saída tem um cliente que a usa de fato.
- Quando duas fontes discordam, está dito qual é a **fonte da verdade**.
- Estão listadas as **exceções**: entrada atrasada, duplicada, errada ou ausente.
- Cabe em 7 etapas. Se passou, subir um nível de abstração.

## O que evitar

- Virar fluxograma (decisões, losangos, cliques). SIPOC não detalha.
- Documentar o processo ideal no modo atual.
- Confundir **cliente** (quem recebe a saída) com **usuário** (quem opera a ferramenta); podem ser a mesma pessoa, mas é preciso dizer.
- Esconder a dor: o SIPOC deve apontar onde o tempo, o erro e o retrabalho se concentram, senão não ajuda a recortar o projeto.

## Registro no repositório Brainstorm

Quando usado dentro do processo deste repositório, as regras de quando entra e onde registrar estão em `CLAUDE.md` (seção "Ferramentas de análise"). Em resumo: o rascunho do processo atual abre a Rodada 1, e a versão futura vai para a spec.
