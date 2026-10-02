# plano-contingencia-agua — entregas (v0.1, rascunho para revisão técnica)

Kit **genérico** de contingência, manutenção e monitoramento dos sistemas de água. Nenhum dado de condomínio mora aqui: fichas, contatos e relatórios ficam no OneDrive, nunca no GitHub.

| Pasta / arquivo | O que é |
|---|---|
| `revisao-tecnica/pacote-de-revisao-tecnica` | **Comece por aqui para revisar.** 14 itens de segurança e saúde, 15 valores a fixar, 10 decisões de política e as referências a confirmar, com folha de resposta (A / J / N / ?) |
| `catalogo/catalogo-v2.md` | Catálogo de 195 sistemas, 16 famílias de manutenção, 18 interligações críticas |
| `planilha-mestre/planilha-mestre.xlsx` | Ficha por condomínio (em branco): catálogo S/N/?, matriz item × cenário, manutenção, autovistoria, contatos, incidentes, resumo |
| `cenarios/01-contaminacao-cruzada/` | Cenário 1: procedimento, fluxograma A3/A4, checklist de autovistoria |
| `cenarios/02-falta-de-agua/` | Cenário 2: procedimento, fluxograma A3/A4 |
| `cenarios/03-agua-fora-do-padrao/` | Cenário 3: procedimento, fluxograma A3/A4 |
| `cenarios/05-falha-de-bomba-ou-energia/` | Cenário 5: procedimento, fluxograma A3/A4 |
| `cenarios/08-falha-do-tratamento-quimico/` | Cenário 8: procedimento, fluxograma A3/A4 |
| `cenarios/09-contaminacao-do-reservatorio/` | Cenário 9: procedimento, fluxograma A3/A4 |
| `rotinas/checklist-relatorio-mensal-fornecedores` | Checklist padrão para anexar ao relatório mensal dos fornecedores, com os 5 itens críticos semanais e carta-modelo à administradora |
| `rotinas/checklist-ronda-sentinela` | Checklist da ronda 24h com torneira sentinela e pontos fixos, ligando cada achado ao cenário |

**Faltam** os cenários 4 (vazamento e alagamento), 6 (incêndio com reserva indisponível), 7 (refluxo de esgoto) e a comunicação de crise (T), e o piloto.

**Fontes editáveis:** os `.md` e os `.mmd` (Mermaid). PDF, Word e a planilha são **gerados**; edite a fonte e regere.

**Planilha-mestre:** gerada a partir do `catalogo-v2.md`. As fórmulas foram conferidas por um motor de cálculo em Python com uma ficha de teste preenchida; o Excel recalcula tudo ao abrir. Se o catálogo mudar, peça para regerar e copie as respostas S/N/? de cada condomínio pelos IDs, que não mudam.

Itens ⚠ nos procedimentos e referências ◻ no catálogo precisam de validação por responsável técnico antes de uso oficial.
