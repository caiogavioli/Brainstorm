# plano-contingencia-agua — entregas (v0.1, rascunho para revisão técnica)

Kit **genérico** de contingência, manutenção e monitoramento dos sistemas de água. Nenhum dado de condomínio mora aqui: fichas, contatos e relatórios ficam no OneDrive, nunca no GitHub.

| Pasta / arquivo | O que é |
|---|---|
| `catalogo/catalogo-v2.md` | Catálogo de 195 sistemas, 16 famílias de manutenção, 18 interligações críticas |
| `planilha-mestre/planilha-mestre.xlsx` | Ficha por condomínio (em branco): catálogo S/N/?, matriz item × cenário, manutenção, autovistoria, contatos, incidentes, resumo |
| `cenarios/01-contaminacao-cruzada/` | Cenário 1: procedimento, fluxograma A3/A4, checklist de autovistoria |
| `cenarios/02-falta-de-agua/` | Cenário 2: procedimento, fluxograma A3/A4 |
| `cenarios/05-falha-de-bomba-ou-energia/` | Cenário 5: procedimento, fluxograma A3/A4 |

**Faltam** os cenários 3 (água fora do padrão), 4 (vazamento e alagamento), 6 (incêndio com reserva indisponível), 7 (refluxo de esgoto), 8 (falha do tratamento químico), 9 (contaminação do reservatório) e a comunicação de crise (T), e o piloto.

**Fontes editáveis:** os `.md` e os `.mmd` (Mermaid). PDF, Word e a planilha são **gerados**; edite a fonte e regere.

**Planilha-mestre:** gerada a partir do `catalogo-v2.md`. As fórmulas foram conferidas por um motor de cálculo em Python com uma ficha de teste preenchida; o Excel recalcula tudo ao abrir. Se o catálogo mudar, peça para regerar e copie as respostas S/N/? de cada condomínio pelos IDs, que não mudam.

Itens ⚠ nos procedimentos e referências ◻ no catálogo precisam de validação por responsável técnico antes de uso oficial.
