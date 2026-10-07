# S-003 — Ajustes depois do fechamento e análise de mais três planilhas

**Data:** 2026-10-07 · **Problema:** P-001 · **Fase:** pós-fechamento (spec no repositório novo)

## O que o usuário disse (palavras dele)

Em resposta aos três pontos em aberto, com os anexos `JIT_PARK___Action_Log_2024_.xlsx`, `PASSEIO_PAULISTA_Action_Log_2026.xlsx` e `Action_Log_2024_Faria_Lima_Tower.xlsx` (ficam fora do repositório):

> B para 1
> 2: a principio vamos nos planos gratuitos, mas tenho a ideia de mudar para um VPS pago no futuro
> 3:opção B. as categorias devem ser inseridas pela propria administradora. cada uma tem uma nomenclatura diferente, e não temos como equalizar todas elas. faça campos com possibilidade de inclusão e exclusão de categorias.

Antes disso, no mesmo dia, ao autorizar o envio do esqueleto:

> criei o repositório vazio, pode enviar
> decisão 6: estou de acordo
> proprietário só lê
> Isso, BRPRA é um setor da CBRE. Vamos manter como CBRE
> vercel+neon

## Decisões

1. **Limite de atraso (opção B):** 7 dias por padrão, parâmetro por condomínio, sem contar Stand by, Concluído e Cancelado.
2. **Hospedagem:** planos gratuitos primeiro, VPS pago depois.
3. **Categorias de despesa (opção B):** cadastradas pela administradora, livres por condomínio, com inclusão e exclusão; sem catálogo padrão.

## O que as três planilhas mostraram (estrutura, sem valores nem nomes de pessoas)

Mesmo molde do Action Log (colunas A–I idênticas nos quatro arquivos), mas **as cópias divergem**:

| | Atrium | JIT Park | Passeio Paulista | Faria Lima Tower |
|---|---|---|---|---|
| Assuntos | 52 | 25 | 30 | 30 (12 sem status) |
| Datas de reunião | 138, semanais | 21, ~mensais | 4 (resto é placeholder `dd/mm/aa`) | 45, ~mensais |
| Observações repetidas | 57% | 37% | 0% | 59% |
| Responsável preenchido | 3 de 52 | 2 de 25 | 30 de 30 | 0 de 30 |
| Abas por ano | Investimentos 2024/2025 | Investimentos 2023–2026, Fluxo 25, Posição 2026 | — | Fluxo 2024/2025/2026, Investimentos 2023–2025 |
| Fundos no Fluxo | 6 (inclui Água, Energia, Individualização) | 8 (Proprietário, Estacionamento, Melhorias, Obras, Privativo/Reembolsável…) | 8 | Ordinário (com utilidades), Privativo, Reserva, Contingência + conciliação |
| Categorias de despesa (Fundo Ordinário) | 13, genéricas | 10 | ~76, com código (08.01…30.03), plano de contas da administradora | 2 (ordinárias × utilidades) |
| Orçado | ausente | aba "Previ x Real" (previsto × realizado × variação, custo/m²) | ausente | linha PREVISTO |
| Abas extras | — | — | — | "Visita Operacional Sindic" (176 linhas), "Plano de ação SDAI" |

Outros achados: JIT Park tem colunas extras em Investimentos (status das propostas, de aprovação e do contrato, previsão de início e de finalização); o saving "fantasma" (teto − executado em item não concluído) aparece em escala: mais de 95% do teto do JIT Park em 2026 e 76% do da Faria Lima em 2025; na Faria Lima as linhas de despesa do Fundo de Reserva são nomes de projetos (as mesmas coisas dos Investimentos).

## Consequências na spec (commit `9d14a5a` do repositório novo)

- **Fundos por condomínio** (lista de tipos + contas livres), não seis fixos.
- **Categorias livres** com código opcional, ordem, arquivar em vez de apagar, cadastro em lote colando do Excel.
- **Orçado × realizado × projetado** por categoria e mês, com variação — confirmado como necessidade real em dois dos quatro condomínios.
- **Migração por leitor tolerante**, não por script de molde único; Forecast pode recomeçar no ano corrente se o arquivo não for legível; item sem status vai para revisão.
- **Investimento** ganha status de propostas, aprovação e contrato e previsão de início e fim.
- **Portabilidade** da hospedagem (Docker desde o início).
- **Atraso** como parâmetro por condomínio (cadência real varia de semanal a mensal).

## Verificado nos termos dos provedores (2026-10-07)

- Vercel Hobby (gratuito): restrito a **uso não comercial**; a definição de comercial inclui projeto usado para ganho financeiro de qualquer envolvido, até quem escreve o código.
- Neon gratuito: 0,5 GB, 100 horas de computação por mês, 6 horas de histórico de restauração.

Por isso o Tomás recomenda **sair do gratuito antes de entrarem dados reais**. **Aguarda ok do usuário**; até lá a spec e o `CLAUDE.md` do projeto só permitem dados sintéticos em ambiente hospedado.

## Em aberto

- Sair do plano gratuito antes de dados reais? (recomendação acima)
- Linha de despesa do Fundo de Reserva × Investimento: vincular para não digitar duas vezes?
- "Planos de ação por origem" na v2 (unifica Auditoria, Visita Operacional e SDAI).
- Quem paga a hospedagem na fase paga.
