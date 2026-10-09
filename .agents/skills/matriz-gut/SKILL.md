---
name: matriz-gut
description: Prioriza problemas, tarefas ou funcionalidades com a Matriz GUT (Gravidade, Urgência, Tendência) e mostra os 3 que devem ser atacados primeiro. Use quando o usuário pedir "GUT", "priorizar", "o que ataco primeiro", ou disser que tudo parece prioridade — em especial quando apresentar 2 ou mais problemas de uma vez ou precisar separar o que entra na v1 do que fica para a v2. Não use para entender um cenário (swot) nem para mapear um processo (sipoc).
---

# Matriz GUT

Serve para **ordenar quando tudo parece prioridade**. Cada item recebe três notas de 1 a 5; a ordem sai da conta, não da ansiedade de quem falou por último.

## Escalas

| Nota | **G**ravidade — o dano se nada for feito | **U**rgência — quanto tempo até precisar agir | **T**endência — o que acontece se nada for feito |
|---|---|---|---|
| **5** | Perda financeira relevante, risco legal/contratual ou a operação para | Já está acontecendo, ou o prazo é hoje | Piora rápido |
| **4** | Grave: retrabalho pesado, cliente reclama, erro que chega ao cliente | Esta semana | Piora aos poucos |
| **3** | Prejudica o resultado, mas contornável | Neste mês | Fica como está |
| **2** | Incômodo leve | Em alguns meses | Melhora um pouco sozinho |
| **1** | Sem impacto real | Pode esperar | Some sozinho |

## Conta

**Score = G × U × T** (de 1 a 125). Maior score = atacar primeiro.

> Nota sobre a soma: muita gente (e muito infográfico) soma em vez de multiplicar. Para os mesmos itens a ordem costuma sair igual, mas a multiplicação separa melhor — um item com nota 1 em qualquer eixo despenca em vez de ficar "médio". Usar produto por padrão; se o usuário preferir soma, fazer a soma e dizer que mudou.

Exemplo (3 itens, mesma ordem pelos dois métodos, afastamento maior no produto):

| Item | G | U | T | Soma | **Produto** |
|---|---|---|---|---|---|
| B | 4 | 5 | 4 | 13 | **80** |
| A | 5 | 4 | 3 | 12 | **60** |
| C | 3 | 3 | 5 | 11 | **45** |

## Procedimento

1. **Listar os itens no mesmo nível.** Não comparar um projeto inteiro com uma tarefa de dez minutos. Se houver mais de 10 itens, agrupar antes.
2. **Propor as notas com justificativa de uma linha por eixo.** Nota sem motivo é palpite. Quando houver time de personas, cada uma pode propor; **diferença de 2 pontos ou mais num eixo é desacordo e vai para o usuário decidir**, com uma frase de cada lado.
3. **Calcular e ordenar.** Mostrar os **3 primeiros** e dizer o que fica de fora.
4. **Desempatar** por maior G; persistindo o empate, pelo item de menor esforço.
5. **Sanidade.** Olhar a ordem e perguntar: "faz sentido?". Se o resultado surpreende, ou uma nota está errada ou falta um critério (a GUT não enxerga esforço, custo nem dependência). Ajustar a nota com justificativa — nunca ajustar para chegar à ordem desejada.
6. **Pedir confirmação.** As notas são proposta; quem conhece a realidade é o usuário.

## Formato de saída

```markdown
## Matriz GUT — <o que está sendo priorizado>

| # | Item | G | U | T | Score | Por quê (G / U / T em uma linha) |
|---|---|---|---|---|---|---|

**Atacar primeiro:** 1) <> 2) <> 3) <>
**Fica para depois, e por quê:** <>
**Desacordos para o usuário decidir:** <>
```

## O que evitar

- Tudo com nota 5. Se tudo é 5, a escala não foi usada: reancorar nos exemplos da tabela.
- Notas sem justificativa.
- Misturar níveis (projeto × tarefa).
- Tratar o score como verdade. É uma ferramenta de conversa; reavaliar quando a realidade mudar (urgência e tendência envelhecem rápido).
- Usar a GUT para decidir **como** resolver. Ela só ordena **o quê** vem primeiro.

## Registro no repositório Brainstorm

Quando usado dentro do processo deste repositório, as regras de quando entra e onde registrar estão em `CLAUDE.md` (seção "Ferramentas de análise"). Em resumo: na Apresentação, com 2 ou mais problemas; e na spec, para separar o escopo da v1 do da v2.
