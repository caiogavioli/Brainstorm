# S-003 — Piloto da análise com casos reais

**Data:** 2026-10-06
**Problema:** P-001 — `problemas/P-001-analise-concorrencias-condominios.md`
**Spec:** `projetos/analise-concorrencias.md`
**Dados:** nenhum arquivo de caso entra neste repositório. Abaixo, só agregados e lições de método (casos numerados, sem condomínio nem fornecedor).

## O que foi rodado

Seis casos, na ordem em que o usuário mandou. Entrada de cada um: o mapa impresso do iPMS (1 a 2 páginas), as propostas (PDF nativo na maioria; dois orçamentos em imagem) e, para o histórico, a exportação do sistema de aprovações.

| Caso | Nível | Valor | Status no iPMS | Parecer |
|---|---|---|---|---|
| 1 | Profunda | acima de R$ 400 mil | Pendente das aprovações 4 e 5 | Devolver |
| 2 | Padrão (valor > R$ 30 mil, mas item de preço por m³) | ~R$ 35 mil | Aprovado | Devolver |
| 3 | Padrão (exceção de fornecedor único) | R$ 7 mil | Aprovado | Assinar com ressalvas |
| 4 | Profunda (contrato de 24 meses) | ~R$ 380 mil | Aprovado | Devolver |
| 5 | Rápida | ~R$ 2,7 mil | Aprovado | Assinar com ressalvas |
| 6 | Profunda (obra) | ~R$ 150 mil | Aprovado | Devolver |

Os casos 2 a 6 já estavam aprovados: a análise foi retrospectiva ("o que teria sido apontado").

## O que a análise achou que o checklist registrado não tinha

| Tipo de achado | Em quantos dos 6 casos |
|---|---|
| Validade do mapa diferente da validade das propostas | 4 (no caso 1, em 4 de 5 fornecedores) |
| Mapa sem itens ou escopo não equalizado entre propostas | 4 |
| Mesma compra repetida em outros QCs (regra de não divisão, via histórico) | 3 |
| Fornecedor sem CNPJ na proposta | 2 |
| Faturamento direto por um terceiro que não consta no mapa | 2 |
| Proposta vencedora com escopo menor que a das concorrentes | 1 |
| Valor da vencedora mudou no histórico sem desconto registrado | 1 |

## Lições de método (entram na skill)

1. **Alçada do iPMS ≠ PRO-004.** O iPMS usa R$ 20 mil como corte: até R$ 20 mil são 4 etapas (Gestor, Regional, Síndico BackOffice, Síndico preposto); acima, 5 (+ Diretor). O manual usa R$ 5 mil e R$ 30 mil. O relatório precisa registrar os cargos de cada aprovação e dizer qual régua aplicou. O usuário é o último aprovador (4º ou 5º).
2. **O mapa lista os arquivos orçamentários.** Comparar com o que foi recebido: no caso 1, 13 listados e 6 recebidos. A lista é pedido automático de documentos faltantes.
3. **O histórico do sistema de aprovações é insumo obrigatório** para CP.26 e para saber se o mesmo escopo já foi aprovado. Exportar e anexar a cada lote até o registro no OneDrive existir.
4. **Severidade por valor.** A mesma falha (mapa sem equalização) é bloqueante em R$ 100 mil e ressalva em R$ 2,7 mil. Falta o usuário definir a régua.
5. **Nível por tipo e por valor.** Valor acima de R$ 30 mil de uma commodity com preço por unidade (m³ de água) não pede relatório Profunda. A regra por valor sozinha erra.
6. **Mérito em Profunda.** Mantive o mérito preliminar mesmo com bloqueante (a spec manda pular). Para decidir com o usuário.
7. **Dados do fornecedor:** CNPJ ausente aparece em propostas de obras e é motivo recorrente de recusa; checar em toda proposta, vencedora ou não.
8. **Erros do próprio Claude no piloto, corrigidos:** (a) citei como inconsistência o nome de uma consultoria que era, na verdade, a emissora do projeto; (b) citei páginas impressas em vez das do PDF; (c) disse que o 4º aprovador era o que faltava, mas faltavam o 4º e o 5º. Regra: citar sempre a página do PDF e revisar toda "inconsistência" contra o contexto antes de listar.
9. **Leitura de imagem funcionou** nos dois orçamentos escaneados: valores lidos e conferidos pela soma.
10. **Tamanho:** os PDFs de relatório ficaram abaixo de 300 KB (limite do conector Microsoft 365 é 1 MB).

## Em aberto (decisões do usuário)

- Régua de severidade por valor (lição 4) e regra de nível por tipo (lição 5).
- Mérito preliminar em Profunda mesmo com bloqueante (lição 6).
- Onde guardar os relatórios: OneDrive (teste de gravação pelo conector ainda não feito).
- Os oito arquivos que faltam no caso 1 e a RFQ.
