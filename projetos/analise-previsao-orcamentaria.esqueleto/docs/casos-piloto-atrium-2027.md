# Casos do piloto — Atrium Santo André (setor Office), PO 2027

Previsão enviada pela Innova em 29/09/2026: planilha de 9 abas e apresentação. Versão do arquivo: `Vs.01_Rev.Cleber_Rev.Joao`.

> **Status: leitura manual preliminar.** Feita a partir da leitura do `.xlsx` por um conector que devolve texto com valores, **sem fórmulas**. Cada caso abaixo é uma **hipótese a confirmar com o script** antes de virar teste ou entrar em parecer. Podem existir falsos positivos.
>
> **Não copiar valores da planilha real para este arquivo, para testes ou para o git.** Aqui só percentuais e a natureza da inconsistência. Os testes usam arquivos sintéticos.

## Regras do verificador (C1–C9)

| Id | Regra |
|---|---|
| C1 | **Reajuste de linha:** valor novo = valor base × (1 + índice aplicável); índice conferido contra a premissa da categoria e contra `dados/indices.csv` |
| C2 | **% declarado × % efetivo:** o % de reajuste escrito na linha bate com a variação real entre os valores mensais e entre os anuais |
| C3 | **Somas:** subtotais, total mensal e total anual = soma das linhas e dos meses; média = total ÷ 12 |
| C4 | **CMQ e fundos:** custo por m² = total ÷ área; fundos = % sobre o total; área igual em todas as abas |
| C5 | **Consistência entre abas:** o mesmo valor aparece igual em abas diferentes |
| C6 | **Variação vs. ano anterior:** recalcular, comparar com a declarada e com os percentuais citados no texto das observações |
| C7 | **Erros de planilha:** `#REF!`, `#DIV/0!`, rótulo desalinhado de valor, fórmula substituída por valor colado (só detectável com fórmulas) |
| C8 | **Premissa × aplicado:** o % da aba de premissas por categoria é o usado na linha |
| C9 | **Índices externos:** IPCA/IGP-M declarados batem com a tabela do time |

## Casos observados

| # | Regra | O que foi visto | Esperado do verificador |
|---|---|---|---|
| 1 | C8 | Limpeza tem premissa de 9% (nota: acordo aprovado maior por prêmio de assiduidade), mas "Serviços de Limpeza" usa 8% | Achado: premissa × aplicado |
| 2 | C2 | "Manutenção de Bombas/Motores" declara 5%, mas os valores mensais sobem 6% | Achado: % declarado × efetivo |
| 3 | C3 / C6 | O "% de Reajuste" dos grupos na aba analítica é a média simples das linhas, não a variação do grupo (ex.: concessionárias: −37,3% na analítica × −39,7% na comparativa) | Achado: % de subtotal inconsistente entre abas |
| 4 | C6 | Observação de "Despesas Gerais" diz "aumento de 14,3% em relação ao realizado", variação da planilha ~7,9% | Achado: texto × número |
| 5 | C4 / C5 | Área privativa total: 17.115,66 m² nas premissas, 17.155,66 m² em "Inclusões PO 2027" | Achado: área divergente |
| 6 | C7 | `#REF!` em várias linhas de "Principais Alterações" e rótulos desalinhados dos valores (bloco que parece de outro ano) | Achado: erro de planilha |
| 7 | C6 | Telefone/Internet justificam "saving", mas contra o realizado a variação é positiva; o saving só existe contra a previsão do ano anterior | Pedido de esclarecimento: "saving contra quê" |
| 8 | C5 | "Inclusões PO 2027" mostra total de acréscimos zero, mas a proposta sobe ~9,1% | Pedido de esclarecimento |
| 9 | — | "Realizado 2026" num documento de setembro de 2026: não é dito se é parcial + projeção | Pedido de esclarecimento |

## Para confirmar com o usuário no piloto

- A regra de conclusão binária (ver `prompts/parecer.md`) classifica este caso como "pode" ou "não pode"?
- Os rótulos desalinhados do caso 6 são lixo conhecido do modelo da Innova (repete todo ano) ou erro novo?
- A média simples do caso 3 é o jeito de a Innova sempre apresentar o "% de Reajuste" por grupo?
